////////////////////////////////////////////////////////////////////////////////
// Auth Constants

export const AUTH_STATUS_TYPES = {
  IDLE: "idle",
  UNAUTHENTICATED: "unauthenticated",
  AUTHENTICATING: "authenticating",
  AUTHENTICATED: "authenticated",
};

export const AUTH_STATUS = {
  ...AUTH_STATUS_TYPES,
  INITIAL: AUTH_STATUS_TYPES.IDLE,
};

export const BASE_AUTH_CONTEXT = {
  authStatus: AUTH_STATUS.INITIAL,
  authUser: null,
  user: null,
};

// Ten minutes
export const AUTH_REFRESH_INTERVAL = 10 * 60 * 1000;
