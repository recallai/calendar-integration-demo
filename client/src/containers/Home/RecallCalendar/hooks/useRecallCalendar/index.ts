import { useState, useReducer, useEffect } from "react";

import {
  tokenReducer,
  fetchToken,
  TOKEN_INITIAL_STATE,
  TokenState,
} from "./auth";
import {
  userReducer,
  fetchUser,
  savePreferences,
  USER_INITIAL_STATE,
  UserState,
  deleteUser,
} from "./user";
import {
  meetingsReducer,
  fetchMeetings,
  refreshMeetings,
  updateMeeting,
  MEETINGS_INITIAL_STATE,
  MeetingsState,
} from "./meetings";
import { buildUrl, buildGoogleOAuthUrl, buildMSOAuthUrl } from "./api";
import { CalendarPlatform, Preferences } from "./models";

type HookArgs = {
  userId: string;
  authUrl: string;
  googleOAuthClientId: string;
  msOAuthClientId: string;
};

export type UseRecallCalendarState = {
  token: TokenState;
  user: UserState;
  meetings: MeetingsState;
  initializeComplete: boolean;
  initializeError: string | null;
  connectCalendar: (platform: CalendarPlatform) => void;
  refreshCalendar: () => void;
  updateMeeting: (meetingId: string, overrideShouldRecord: boolean) => void;
  savePreferences: (preferences: Preferences, callback?: () => void) => void;
  disconnectCalendar: (callback?: () => void) => void;
};

export default function useRecallCalendar(
  args: HookArgs
): UseRecallCalendarState {
  const { authUrl, userId, googleOAuthClientId, msOAuthClientId } = args;
  const [initializeComplete, setInitializeComplete] = useState<boolean>(false);
  const [initializeError, setInitializeError] = useState<string | null>(null);
  const [token, tokenDispatch] = useReducer(tokenReducer, TOKEN_INITIAL_STATE);
  const [user, userDispatch] = useReducer(userReducer, USER_INITIAL_STATE);
  const [meetings, meetingsDispatch] = useReducer(
    meetingsReducer,
    MEETINGS_INITIAL_STATE
  );

  useEffect(() => {
    async function initialize() {
      try {
        const authToken = await fetchToken({
          tokenDispatch,
          authUrl,
          userId,
        });
        if (!authToken) {
          setInitializeError("AUTH_TOKEN_NOT_FOUND");
          return;
        }

        await Promise.all([
          fetchUser({
            authToken,
            userDispatch,
          }),
          fetchMeetings({
            authToken,
            meetingsDispatch,
          }),
        ]);

        setInitializeComplete(true);
      } catch (err) {
        console.log(err, "error in initialization");
        setInitializeError("GENERIC_ERROR");
      }
    }

    initialize();
  }, []);

  return {
    token,
    user,
    meetings,
    initializeComplete,
    initializeError,

    refreshCalendar: () => {
      refreshMeetings({
        meetingsDispatch,
        authToken: token.data,
      });
    },

    updateMeeting: (meetingId: string, overrideShouldRecord: boolean) => {
      updateMeeting({
        meetingsDispatch,
        authToken: token.data,
        meetingId,
        overrideShouldRecord,
      });
    },

    savePreferences: (preferences: Preferences, callback?: () => void) => {
      savePreferences({
        authToken: token.data,
        userDispatch,
        preferences,
      }).then(() => {
        fetchMeetings({
          meetingsDispatch,
          authToken: token.data,
        });
        if (callback) {
          callback();
        }
      });
    },

    disconnectCalendar: (callback?: () => void) => {
      deleteUser({ authToken: token.data }).then((deleteSuccessful) => {
        if (callback && deleteSuccessful) {
          callback();
        }
      });
    },

    connectCalendar: (platform: CalendarPlatform): void => {
      let redirectUri;
      let oAuthUrl;
      if (platform === CalendarPlatform.GOOGLE) {
        redirectUri = buildUrl("google_oauth_callback/");
        oAuthUrl = buildGoogleOAuthUrl({
          state: {
            recall_calendar_auth_token: token.data,
            google_oauth_redirect_url: redirectUri,
          },
          redirectUri,
          clientId: googleOAuthClientId,
        });
      } else {
        redirectUri = buildUrl("ms_oauth_callback/");
        oAuthUrl = buildMSOAuthUrl({
          state: {
            recall_calendar_auth_token: token.data,
            ms_oauth_redirect_url: redirectUri,
          },
          redirectUri,
          clientId: msOAuthClientId,
        });
      }

      window.open(oAuthUrl);

      const intervalId = setInterval(async () => {
        const user = await fetchUser({
          authToken: token.data,
          userDispatch,
        });

        if (
          user?.connections.filter(
            (c) =>
              c.platform === CalendarPlatform.GOOGLE ||
              c.platform === CalendarPlatform.MICROSOFT
          )[0]?.connected
        ) {
          clearInterval(intervalId);
          fetchMeetings({
            meetingsDispatch,
            authToken: token.data,
          });
        }
      }, 2000);
    },
  };
}
