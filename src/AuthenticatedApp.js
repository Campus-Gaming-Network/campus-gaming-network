// Libraries
import React from "react";
import { Router } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";
import { Box } from "@chakra-ui/core";

// Other
import { firebaseAuth } from "./firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "./store";

// Hooks
import useFetchUserDetails from "./hooks/useFetchUserDetails";
import useFetchSchoolDetails from "./hooks/useFetchSchoolDetails";

// Pages
import Home from "./pages";
import School from "./pages/school";
import User from "./pages/user";
import Event from "./pages/event";
import EditUser from "./pages/edit-user";
import EditSchool from "./pages/edit-school";
import CreateEvent from "./pages/create-event";
import NotFound from "./pages/not-found";

// Components
import AuthenticatedNav from "./components/AuthenticatedNav";
import ScrollToTop from "./components/ScrollToTop";
import NavSilhouette from "./components/NavSilhouette";
import FormSilhouette from "./components/FormSilhouette";
import UserSilhouette from "./components/UserSilhouette";
import SchoolSilhouette from "./components/SchoolSilhouette";
import EventSilhouette from "./components/EventSilhouette";

const AuthenticatedApp = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [user, isFetchingUser] = useFetchUserDetails(
    authenticatedUser ? authenticatedUser.uid : null
  );
  const [school, isFetchingSchool] = useFetchSchoolDetails(
    user ? user.school.id : null
  );
  const isLoadingUserData = React.useMemo(
    () => isEmpty(state.user) || isAuthenticating || isFetchingUser,
    [state.user, isAuthenticating, isFetchingUser]
  );
  const isLoadingUserSchoolData = React.useMemo(
    () => isEmpty(state.school) || isAuthenticating || isFetchingSchool,
    [state.school, isAuthenticating, isFetchingSchool]
  );
  const shouldSetUser = React.useMemo(
    () => !!user && (isEmpty(state.user) || state.user.id !== user.id),
    [user, state.user]
  );
  const shouldSetSchool = React.useMemo(
    () => !!school && (isEmpty(state.school) || state.school.id !== school.id),
    [school, state.school]
  );
  const isReady = React.useMemo(
    () => !isLoadingUserData && !isLoadingUserSchoolData,
    [isLoadingUserData, isLoadingUserSchoolData]
  );
  const [nav, setNav] = React.useState(<NavSilhouette />);
  const [routes, setRoutes] = React.useState(<SilhouetteRoutes />);

  React.useEffect(() => {
    if (shouldSetUser) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: user
      });
    }
  }, [dispatch, shouldSetUser, user]);

  React.useEffect(() => {
    if (shouldSetSchool) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [dispatch, shouldSetSchool, school]);

  React.useEffect(() => {
    if (isReady) {
      setNav(<AuthenticatedNav />);
      setRoutes(<Routes />);
    }
  }, [isReady]);

  return (
    <React.Fragment>
      {nav}
      <Box as="main" pb={12}>
        {routes}
      </Box>
    </React.Fragment>
  );
};

const SilhouetteRoutes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Home path="/" />
        <FormSilhouette path="edit-user" />
        <UserSilhouette path="user/:id" />
        <SchoolSilhouette path="school/:id" />
        <FormSilhouette path="school/:id/edit" />
        <FormSilhouette path="create-event" />
        <EventSilhouette path="event/:id" />
        <FormSilhouette path="event/:id/edit" />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

const Routes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Home path="/" />
        <EditUser path="edit-user" />
        <User path="user/:id" />
        <School path="school/:id" />
        <EditSchool path="school/:id/edit" />
        <CreateEvent path="create-event" />
        <Event path="event/:id" />
        <CreateEvent path="event/:id/edit" edit={true} />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default AuthenticatedApp;
