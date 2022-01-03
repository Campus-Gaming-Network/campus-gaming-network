import React from "react";
import { onIdTokenChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

// Other
import { db, auth } from "../firebase";

// Utilities
import { saveStorageItem, deleteStorageItem } from "../utilities/storage";

// Constants
import { STORAGE_KEYS } from "../constants/storage";
import {
  AUTH_STATUS,
  BASE_AUTH_CONTEXT,
  AUTH_REFRESH_INTERVAL,
} from "../constants/auth";

////////////////////////////////////////////////////////////////////////////////
// AuthContext

const AuthContext = React.createContext(BASE_AUTH_CONTEXT);

////////////////////////////////////////////////////////////////////////////////
// AuthProvider

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = React.useState(AUTH_STATUS.INITIAL);
  const [authUser, setAuthUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
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

  const clearAuth = async () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[AUTH] Clearing auth.");
    }

    setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
    setAuthUser(null);
    setUser(null);

    await deleteStorageItem(STORAGE_KEYS.AUTH);
  };

  const setAuth = async (token) => {
    await saveStorageItem(STORAGE_KEYS.AUTH, token);

    setAuthStatus(AUTH_STATUS.AUTHENTICATED);
  };

  React.useEffect(() => {
    setAuthStatus(AUTH_STATUS.AUTHENTICATING);

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
        let userDoc;

        try {
          userDoc = await getDoc(doc(db, "users", authUser.uid));
        } catch (error) {
          console.error(`[AUTH] Error getting user.`, error);
          clearAuth();
          return;
        }

        if (userDoc.exists) {
          setUser(userDoc.data());
        } else {
          console.error(`[AUTH] User does not exist.`, error);
          clearAuth();
          return;
        }
      }

      await deleteStorageItem(STORAGE_KEYS.AUTH);

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
    isAuthenticated,
    isAuthenticating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
