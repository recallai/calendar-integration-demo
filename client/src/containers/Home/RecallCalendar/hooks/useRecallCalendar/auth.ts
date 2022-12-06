import { makeRequest } from "./api";

export enum TokenActionKind {
  FETCH_START = "FETCH_START",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_ERROR = "FETCH_ERROR",
  FETCH_FINISH = "FETCH_FINISH",
}

export type TokenState = {
  data: string | null;
  loading: boolean;
  error: Error | null;
};

export type TokenAction = {
  type: TokenActionKind;
  payload?: any;
};

export const TOKEN_INITIAL_STATE = {
  data: null,
  loading: true,
  error: null,
};

export function tokenReducer(state: TokenState, action: TokenAction) {
  const { type, payload } = action;
  switch (type) {
    case TokenActionKind.FETCH_START:
      return { ...state, loading: true };
    case TokenActionKind.FETCH_FINISH:
      return { ...state, loading: false };
    case TokenActionKind.FETCH_SUCCESS:
      return { ...state, data: payload, error: null };
    case TokenActionKind.FETCH_ERROR:
      return { ...state, data: null, error: payload };
    default:
      return state;
  }
}

type FetchTokenArgs = {
  tokenDispatch: (action: TokenAction) => void;
  authUrl: string;
  userId: string;
};
type FetchTokenResponse = {
  token?: string;
};
export async function fetchToken({
  tokenDispatch,
  authUrl,
  userId,
}: FetchTokenArgs) {
  let authToken;

  tokenDispatch({ type: TokenActionKind.FETCH_START });
  try {
    const response = await makeRequest<FetchTokenResponse>({
      url: authUrl,
      method: "POST",
      data: { userId },
    });

    if (response.token) {
      authToken = response.token;
      tokenDispatch({
        type: TokenActionKind.FETCH_SUCCESS,
        payload: response.token,
      });
    }
  } catch (err) {
    tokenDispatch({
      type: TokenActionKind.FETCH_ERROR,
      payload: err,
    });
  }

  tokenDispatch({ type: TokenActionKind.FETCH_FINISH });
  return authToken;
}
