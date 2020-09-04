import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Other
import { firebaseAuth } from "./firebase";

// Components
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [app, setApp] = React.useState(<UnauthenticatedApp />);
  const isAuthenticated = React.useMemo(
    () => !isAuthenticating && !!authenticatedUser,
    [isAuthenticating, authenticatedUser]
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      setApp(<AuthenticatedApp />);
    } else {
      setApp(<UnauthenticatedApp />);
    }
  }, [isAuthenticated]);

  return app;
};

export default App;
