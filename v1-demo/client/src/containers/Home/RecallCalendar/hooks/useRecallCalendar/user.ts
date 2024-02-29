import type { Preferences, User } from "./models";
import { makeRequest, buildUrl } from "./api";

export enum UserActionKind {
  FETCH_START = "FETCH_START",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_ERROR = "FETCH_ERROR",
  FETCH_FINISH = "FETCH_FINISH",

  SAVE_PREFERENCES_START = "SAVE_PREFERENCES_START",
  SAVE_PREFERENCES_SUCCESS = "SAVE_PREFERENCES_SUCCESS",
  SAVE_PREFERENCES_ERROR = "SAVE_PREFERENCES_ERROR",
  SAVE_PREFERENCES_FINISH = "SAVE_PREFERENCES_FINISH",
}

export type UserState = {
  data?: User;
  loading: boolean;
  error?: Error;
  savingPreferences: boolean;
};

export type UserAction = {
  type: UserActionKind;
  user?: User;
  error?: Error;
};

export const USER_INITIAL_STATE = {
  loading: true,
  savingPreferences: false,
};

export function userReducer(state: UserState, action: UserAction) {
  const { type } = action;
  switch (type) {
    case UserActionKind.FETCH_START:
      return { ...state, loading: true };
    case UserActionKind.FETCH_FINISH:
      return { ...state, loading: false };
    case UserActionKind.FETCH_SUCCESS:
      return { ...state, data: action.user, error: undefined };
    case UserActionKind.FETCH_ERROR:
      return { ...state, data: undefined, error: action.error };

    case UserActionKind.SAVE_PREFERENCES_START:
      return { ...state, savingPreferences: true };
    case UserActionKind.SAVE_PREFERENCES_FINISH:
      return { ...state, savingPreferences: false };
    case UserActionKind.SAVE_PREFERENCES_SUCCESS:
      return { ...state, data: action.user, error: undefined };
    case UserActionKind.SAVE_PREFERENCES_ERROR:
      return { ...state, data: undefined, error: action.error };

    default:
      return state;
  }
}

type FetchUserArgs = {
  userDispatch: (action: UserAction) => void;
  authToken: string;
};

export async function fetchUser({ userDispatch, authToken }: FetchUserArgs) {
  userDispatch({ type: UserActionKind.FETCH_START });
  try {
    const response = await makeRequest<User>({
      token: authToken,
      url: buildUrl("user/"),
      method: "GET",
    });

    if (response?.id) {
      userDispatch({
        type: UserActionKind.FETCH_SUCCESS,
        user: response,
      });
      userDispatch({ type: UserActionKind.FETCH_FINISH });
      return response;
    }
  } catch (err) {
    userDispatch({
      type: UserActionKind.FETCH_ERROR,
      error: err as Error,
    });
    userDispatch({ type: UserActionKind.FETCH_FINISH });
  }
}

type SavePreferencesArgs = {
  userDispatch: (action: UserAction) => void;
  authToken: string;
  preferences: Preferences;
};
export async function savePreferences({
  userDispatch,
  authToken,
  preferences,
}: SavePreferencesArgs) {
  userDispatch({ type: UserActionKind.SAVE_PREFERENCES_START });
  try {
    const response = await makeRequest<User>({
      token: authToken,
      url: buildUrl("user/"),
      method: "PUT",
      data: { preferences },
    });

    if (response?.id) {
      userDispatch({
        type: UserActionKind.SAVE_PREFERENCES_SUCCESS,
        user: response,
      });
      userDispatch({ type: UserActionKind.SAVE_PREFERENCES_FINISH });
      return response;
    }
  } catch (err) {
    userDispatch({
      type: UserActionKind.SAVE_PREFERENCES_ERROR,
      error: err as Error,
    });
    userDispatch({ type: UserActionKind.SAVE_PREFERENCES_FINISH });
  }
}

type DeleteUserArgs = {
  authToken: string;
};
export async function deleteUser({ authToken }: DeleteUserArgs) {
  try {
    await makeRequest<User>({
      token: authToken,
      url: buildUrl("user/"),
      method: "DELETE",
    });
    return true;
  } catch (err) {
    return false
  }
}
