// Libraries
import React from "react";
import { Router } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";

// Other
import { firebaseAuth } from "./firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "./store";

// Hooks
import useFetchUserSchool from "./hooks/useFetchUserSchool";
import useFetchUserDetails from "./hooks/useFetchUserDetails";

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
import Header from "./components/Header";
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
  const [user] = useFetchUserDetails(authenticatedUser.uid);
  const [school] = useFetchUserSchool(user);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [nav, setNav] = React.useState(<NavSilhouette />);
  const [routes, setRoutes] = React.useState(<SilhouetteRoutes />);

  const setUser = React.useCallback(() => {
    const hasUser = !!user;
    const hasUserState = !isEmpty(state.user);

    if (hasUser && !hasUserState) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: user
      });
    }
  }, [dispatch, user, state.user]);

  const setSchool = React.useCallback(() => {
    const hasSchool = !!school;
    const hasSchoolState = !isEmpty(state.school);

    if (hasSchool && !hasSchoolState) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [dispatch, school, state.school]);

  React.useEffect(() => {
    setUser();
  }, [setUser, user, state.user]);

  React.useEffect(() => {
    setSchool();
  }, [setSchool, school, state.school]);

  React.useEffect(() => {
    const hasUserState = !isEmpty(state.user);
    const hasSchoolState = !isEmpty(state.school);
    const isLoading = !hasUserState || !hasSchoolState || isAuthenticating;

    if (isLoading !== isLoadingUser) {
      setIsLoadingUser(isLoading);
    }
  }, [state.user, state.school, isLoadingUser, isAuthenticating]);

  React.useEffect(() => {
    if (!isLoadingUser) {
      setNav(<AuthenticatedNav />);
      setRoutes(<Routes />);
    }
  }, [isLoadingUser]);

  return (
    <React.Fragment>
      <Header>{nav}</Header>
      <main className="pb-12">{routes}</main>
    </React.Fragment>
  );
};

const SilhouetteRoutes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Home path="/" />
        <FormSilhouette path="user/edit" />
        <UserSilhouette path="user/:id" />
        <FormSilhouette path="school/edit" />
        <SchoolSilhouette path="school/:id" />
        <FormSilhouette path="event/create" />
        <EventSilhouette path="event/:id" />
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
        <EditUser path="user/edit" />
        <User path="user/:id" />
        <EditSchool path="school/edit" />
        <School path="school/:id" />
        <CreateEvent path="event/create" />
        <Event path="event/:id" />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default AuthenticatedApp;
