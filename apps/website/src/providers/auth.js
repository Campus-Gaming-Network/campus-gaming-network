////////////////////////////////////////////////////////////////////////////////
// Source: https://colinhacks.com/essays/nextjs-firebase-authentication

import React from "react";
import nookies from "nookies";
import { onIdTokenChanged } from "firebase/auth";

// Other
import { auth } from "src/firebase";
import { API } from "src/api/new";

// Constants
import { COOKIES } from "src/constants/other";
import {
  AUTH_STATUS,
  BASE_AUTH_CONTEXT,
  AUTH_REFRESH_INTERVAL,
} from "src/constants/auth";

// Utilities
import { mapUser } from "src/utilities/user";
import { mapSchool } from "src/utilities/school";

////////////////////////////////////////////////////////////////////////////////
// AuthContext

const AuthContext = React.createContext(BASE_AUTH_CONTEXT);

////////////////////////////////////////////////////////////////////////////////
// AuthProvider

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = React.useState(AUTH_STATUS.INITIAL);
  const [authUser, setAuthUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [school, setSchool] = React.useState(null);
  const isAuthenticated = React.useMemo(
    () => authStatus === AUTH_STATUS.AUTHENTICATED,
    [authStatus]
  );
  const isAuthenticating = React.useMemo(
    () =>
      authStatus === AUTH_STATUS.AUTHENTICATING ||
      authStatus === AUTH_STATUS.IDLE,
    [authStatus]
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[AUTH] Status -> ${authStatus}`);
    }
  }, [authStatus, process.env.NODE_ENV]);

  const clearAuth = () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[AUTH] Clearing auth.");
    }

    setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
    setAuthUser(null);
    setUser(null);
    setSchool(null);

    nookies.destroy(null, COOKIES.AUTH_TOKEN);
    nookies.set(null, COOKIES.AUTH_TOKEN, "", { path: COOKIES.PATH });
  };

  const setAuth = (token) => {
    nookies.set(null, COOKIES.AUTH_TOKEN, token, { path: COOKIES.PATH });

    setAuthStatus(AUTH_STATUS.AUTHENTICATED);
  };

  React.useEffect(() => {
    setAuthStatus(AUTH_STATUS.AUTHENTICATING);

    if (typeof window !== "undefined") {
      window.nookies = nookies;
    }

    return onIdTokenChanged(auth, async (authUser) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH] Token changed!");
      }

      if (!Boolean(authUser)) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[AUTH] No auth user found.");
        }
        clearAuth();
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH] Updating token.");
      }

      let token;

      try {
        token = await authUser.getIdToken();
      } catch (error) {
        console.error(`[AUTH] Error getting token.`, error);
        clearAuth();
        return;
      }

      setAuthUser(authUser);

      if (Boolean(authUser) && Boolean(authUser.uid)) {
        let user;

        try {
          const response = await API().Auth.getUser(authUser.uid);
          user = response.data.user;
        } catch (error) {
          console.error(`[AUTH] Error getting user.`, error);
          clearAuth();
          return;
        }

        if (Boolean(user)) {
          setUser(mapUser(user));
          setSchool(mapSchool(user.school));
        } else {
          console.error(`[AUTH] User does not exist.`, error);
          clearAuth();
          return;
        }
      }

      nookies.destroy(null, COOKIES.AUTH_TOKEN);

      if (Boolean(token)) {
        setAuth(token);
      }
    });
  }, []);

  // Force refresh the token
  React.useEffect(() => {
    const handle = setInterval(async () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH] Refreshing token.");
      }

      const authUser = auth.currentUser;

      if (Boolean(authUser)) {
        try {
          await authUser.getIdToken(true);
        } catch (error) {
          console.error(`[AUTH] Error getting token.`, error);
          clearAuth();
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log("[AUTH] No auth user found.");
        }
        clearAuth();
      }
    }, AUTH_REFRESH_INTERVAL);
    return () => clearInterval(handle);
  }, []);

  const value = {
    authStatus,
    authUser,
    user,
    school,
    isAuthenticated,
    isAuthenticating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
