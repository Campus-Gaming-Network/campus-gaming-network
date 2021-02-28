////////////////////////////////////////////////////////////////////////////////
// Auth Utilities

import { AUTH_STATUS } from "src/constants/auth";

export const hasToken = cookies => {
  return Boolean(cookies) && Boolean(cookies.token);
};

export const hasUid = token => {
  return Boolean(token) && Boolean(token.uid);
};

export const getAuthStatus = token => {
  return hasUid(token)
    ? AUTH_STATUS.AUTHENTICATED
    : AUTH_STATUS.UNAUTHENTICATED;
};
