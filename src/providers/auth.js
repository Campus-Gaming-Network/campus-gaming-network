import React from "react";
import nookies from "nookies";
import { firebase } from "src/firebase";

// Source: https://colinhacks.com/essays/nextjs-firebase-authentication

const AuthContext = React.createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.nookies = nookies;
    }

    return firebase.auth().onIdTokenChanged(async user => {
      console.log(`token changed!`);

      if (!user) {
        console.log(`no token found...`);

        setUser(null);

        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        return;
      }

      console.log(`updating token...`);

      const token = await user.getIdToken();

      setUser(user);

      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
    });
  }, []);

  // force refresh the token every 10 minutes
  React.useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);

      const user = firebase.auth().currentUser;

      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};
