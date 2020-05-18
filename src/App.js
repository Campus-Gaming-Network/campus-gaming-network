import React from "react";
import { useLocation } from "@reach/router";
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
// App2

const App2 = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [schools] = useFetchSchools(location.pathname);

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

  return !isAuthenticating && !!authenticatedUser ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
};

export default App2;
