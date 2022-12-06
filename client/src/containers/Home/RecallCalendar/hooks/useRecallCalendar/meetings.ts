import type { CalendarMeeting } from "./models";
import { makeRequest, buildUrl } from "./api";

export enum MeetingsActionKind {
  FETCH_START = "FETCH_START",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_ERROR = "FETCH_ERROR",
  FETCH_FINISH = "FETCH_FINISH",

  REFRESH_START = "REFRESH_START",
  REFRESH_SUCCESS = "REFRESH_SUCCESS",
  REFRESH_ERROR = "REFRESH_ERROR",
  REFRESH_FINISH = "REFRESH_FINISH",

  RECORD_MEETING_START = "RECORD_MEETING_START",
  RECORD_MEETING_SUCCESS = "RECORD_MEETING_SUCCESS",
  RECORD_MEETING_ERROR = "RECORD_MEETING_ERROR",
  RECORD_MEETING_FINISH = "RECORD_MEETING_FINISH",
}

export type MeetingsState = {
  data?: CalendarMeeting[];
  loading: boolean;
  refresh: boolean;
  error?: Error;
};

export type MeetingsAction = {
  type: MeetingsActionKind;
  meetings?: CalendarMeeting[];
  error?: Error;
  meetingId?: string;
  meeting?: CalendarMeeting;
};

export const MEETINGS_INITIAL_STATE = {
  loading: true,
  refresh: false,
};

export function meetingsReducer(state: MeetingsState, action: MeetingsAction) {
  const { type } = action;

  switch (type) {
    case MeetingsActionKind.FETCH_START:
      return { ...state, loading: true };
    case MeetingsActionKind.FETCH_FINISH:
      return { ...state, loading: false };
    case MeetingsActionKind.REFRESH_START:
      return { ...state, refresh: true };
    case MeetingsActionKind.REFRESH_FINISH:
      return { ...state, refresh: false };

    case MeetingsActionKind.FETCH_SUCCESS:
    case MeetingsActionKind.REFRESH_SUCCESS:
      return { ...state, data: action.meetings, error: undefined };

    case MeetingsActionKind.FETCH_ERROR:
    case MeetingsActionKind.REFRESH_ERROR:
      return { ...state, error: action.error, data: undefined };

    case MeetingsActionKind.RECORD_MEETING_SUCCESS:
      return {
        ...state,
        data: state.data
          ? state.data.map((meeting: CalendarMeeting) => {
              return meeting.id === action.meeting?.id
                ? action.meeting
                : meeting;
            })
          : undefined,
      };

    default:
      return state;
  }
}

type FetchMeetingsArgs = {
  meetingsDispatch: (action: MeetingsAction) => void;
  authToken: string;
};

export async function fetchMeetings({
  meetingsDispatch,
  authToken,
}: FetchMeetingsArgs) {
  meetingsDispatch({ type: MeetingsActionKind.FETCH_START });
  try {
    const response = await makeRequest<CalendarMeeting[]>({
      token: authToken,
      url: buildUrl("meetings/"),
      method: "GET",
    });

    if (response?.length) {
      meetingsDispatch({
        type: MeetingsActionKind.FETCH_SUCCESS,
        meetings: response,
      });
    }
  } catch (err) {
    meetingsDispatch({
      type: MeetingsActionKind.FETCH_ERROR,
      error: err as Error,
    });
  }
  meetingsDispatch({ type: MeetingsActionKind.FETCH_FINISH });
}

export async function refreshMeetings({
  meetingsDispatch,
  authToken,
}: FetchMeetingsArgs) {
  meetingsDispatch({ type: MeetingsActionKind.REFRESH_START });
  try {
    const response = await makeRequest<CalendarMeeting[]>({
      token: authToken,
      url: buildUrl("meetings/refresh"),
      method: "POST",
    });

    if (response?.length) {
      meetingsDispatch({
        type: MeetingsActionKind.REFRESH_SUCCESS,
        meetings: response,
      });
    }
  } catch (err) {
    meetingsDispatch({
      type: MeetingsActionKind.REFRESH_ERROR,
      error: err as Error,
    });
  }
  meetingsDispatch({ type: MeetingsActionKind.REFRESH_FINISH });
}

type UpdateMeetingArgs = {
  meetingsDispatch: (action: MeetingsAction) => void;
  authToken: string;
  meetingId: string;
  overrideShouldRecord: boolean;
};

let meetingUpdateInProgressMap: { [k: string]: boolean } = {};

export async function updateMeeting({
  meetingsDispatch,
  meetingId,
  authToken,
  overrideShouldRecord
}: UpdateMeetingArgs) {
  if (meetingUpdateInProgressMap[meetingId]) {
    return;
  }

  meetingUpdateInProgressMap[meetingId] = true;
  meetingsDispatch({ type: MeetingsActionKind.RECORD_MEETING_START });
  try {
    const response = await makeRequest<CalendarMeeting>({
      token: authToken,
      url: buildUrl(`meetings/${meetingId}/`),
      method: "PUT",
      data: { override_should_record: overrideShouldRecord }
    });

    if (response?.id) {
      meetingsDispatch({
        type: MeetingsActionKind.RECORD_MEETING_SUCCESS,
        meeting: response,
      });
    }
  } catch (err) {
    meetingsDispatch({
      type: MeetingsActionKind.RECORD_MEETING_ERROR,
      error: err as Error,
    });
  }
  meetingsDispatch({ type: MeetingsActionKind.RECORD_MEETING_FINISH });
  delete meetingUpdateInProgressMap[meetingId];
}
