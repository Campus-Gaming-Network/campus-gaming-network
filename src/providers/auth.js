////////////////////////////////////////////////////////////////////////////////
// Source: https://colinhacks.com/essays/nextjs-firebase-authentication

import React from "react";
import nookies from "nookies";

// Other
import firebase from "src/firebase";

// Constants
import { COOKIES } from "src/constants/other";

const AuthContext = React.createContext({ authUser: null, user: null });

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.nookies = nookies;
    }

    return firebase.auth().onIdTokenChanged(async authUser => {
      if (!authUser) {
        setAuthUser(null);

        nookies.destroy(null, COOKIES.AUTH_TOKEN);
        nookies.set(null, COOKIES.AUTH_TOKEN, "", { path: "/" });
        return;
      }

      const token = await authUser.getIdToken();

      setAuthUser(authUser);

      nookies.destroy(null, COOKIES.AUTH_TOKEN);
      nookies.set(null, COOKIES.AUTH_TOKEN, token, { path: "/" });
    });
  }, []);

  // force refresh the token every 10 minutes
  React.useEffect(() => {
    const handle = setInterval(async () => {
      const authUser = firebase.auth().currentUser;

      if (authUser) {
        await authUser.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
