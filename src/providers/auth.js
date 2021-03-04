////////////////////////////////////////////////////////////////////////////////
// Source: https://colinhacks.com/essays/nextjs-firebase-authentication

import React from "react";
import nookies from "nookies";

// Other
import firebase from "src/firebase";

// Constants
import { COOKIES } from "src/constants/other";

// Utilities
import { mapUser } from "src/utilities/user";
import { mapSchool } from "src/utilities/school";
import { noop } from "src/utilities/other";

const AuthContext = React.createContext({
  authStatus: "idle",
  authUser: null,
  user: null,
  school: null
});

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = React.useState("idle");
  const [authUser, setAuthUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [school, setSchool] = React.useState(null);

  React.useEffect(() => {
    setAuthStatus("authenticating");

    if (typeof window !== "undefined") {
      window.nookies = nookies;
    }

    return firebase.auth().onIdTokenChanged(async authUser => {
      console.log(`token changed!`);

      if (!authUser) {
        console.log(`no token found...`);

        setAuthStatus("unauthenticated");
        setAuthUser(null);
        setUser(null);
        setSchool(null);
        setAuthStatus("finished");

        nookies.destroy(null, COOKIES.AUTH_TOKEN);
        nookies.set(null, COOKIES.AUTH_TOKEN, "", { path: "/" });
        return;
      }

      console.log(`updating token...`);

      const token = await authUser.getIdToken();

      setAuthUser(authUser);

      if (Boolean(authUser) && Boolean(authUser.uid)) {
        setAuthStatus("authenticated");
        let userDoc;

        try {
          userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(authUser.uid)
            .get();
        } catch (error) {
          noop();
        }

        if (userDoc.exists) {
          setUser({ ...mapUser(userDoc.data(), userDoc) });

          try {
            const schoolDoc = await firebase
              .firestore()
              .collection("schools")
              .doc(userDoc.data().school.id)
              .get();

            if (schoolDoc.exists) {
              setSchool({ ...mapSchool(schoolDoc.data(), schoolDoc) });
              setAuthStatus("finished");
            }
          } catch (error) {
            console.log("err->", error);
            noop();
          }
        }
      }

      nookies.destroy(null, COOKIES.AUTH_TOKEN);
      nookies.set(null, COOKIES.AUTH_TOKEN, token, { path: "/" });
    });
  }, []);

  // force refresh the token every 10 minutes
  React.useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);

      const authUser = firebase.auth().currentUser;

      if (authUser) {
        await authUser.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, authUser, user, school }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
