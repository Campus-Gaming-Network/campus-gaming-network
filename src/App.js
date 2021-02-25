import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Other
import { auth } from "src/firebase";

// Components
import AuthenticatedApp from "src/components/AuthenticatedApp";
import UnauthenticatedApp from "src/components/UnauthenticatedApp";

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(auth);
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
