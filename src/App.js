import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";

// Other
import { firebaseAuth } from "./firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "./store";

// Components
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

// Hooks
import useFetchSchools from "./hooks/useFetchSchools";

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [schools] = useFetchSchools();
  const [app, setApp] = React.useState(<UnauthenticatedApp />);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const setSchools = React.useCallback(() => {
    const hasSchools = !!schools;
    const hasSchoolsState = !isEmpty(state.schools);

    if (hasSchools && !hasSchoolsState) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOLS,
        payload: schools
      });
    }
  }, [dispatch, schools, state.schools]);

  React.useEffect(() => {
    setSchools();
  }, [setSchools, schools, state.schools]);

  React.useEffect(() => {
    const _isAuthenticated = !isAuthenticating && !!authenticatedUser;

    if (_isAuthenticated !== isAuthenticated) {
      setIsAuthenticated(_isAuthenticated);
    }
  }, [isAuthenticating, authenticatedUser, isAuthenticated]);

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
