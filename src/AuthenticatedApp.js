// Libraries
import React from "react";
import { Router } from "src/components/node_modules/@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";
import { Box } from "@chakra-ui/react";
import { Settings as LuxonSettings } from "luxon";

// Other
import { firebase } from "src/firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "src/store";

// Hooks
import useFetchUserDetails from "src/hooks/useFetchUserDetails";
import useFetchSchoolDetails from "src/hooks/useFetchSchoolDetails";

// Pages
import Home from "pages";
import School from "pages/school/[id]";
import User from "pages/user/[id]";
import Event from "pages/event/[id]";
import EditUser from "pages/edit-user";
import EditSchool from "pages/school/[id]/edit";
import CreateEvent from "pages/create-event";
import AuthAction from "pages/auth-action";
import AboutUs from "pages/about-us";
import FrequentlyAskedQuestions from "pages/frequently-asked-questions";
import NotFound from "pages/404";

// Components
import AuthenticatedNav from "src/components/AuthenticatedNav";
import ScrollToTop from "src/components/ScrollToTop";
import NavSilhouette from "src/components/silhouettes/NavSilhouette";
import FormSilhouette from "src/components/silhouettes/FormSilhouette";
import UserSilhouette from "src/components/silhouettes/UserSilhouette";
import SchoolSilhouette from "src/components/silhouettes/SchoolSilhouette";
import EventSilhouette from "src/components/silhouettes/EventSilhouette";
import Empty from "src/components/Empty";
import Footer from "src/components/Footer";
import VerifyEmailReminderBanner from "src/components/VerifyEmailReminderBanner";

const AuthenticatedApp = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebase.auth());
  const [user, isFetchingUser] = useFetchUserDetails(
    authenticatedUser ? authenticatedUser.uid : null
  );
  const [school, isFetchingSchool] = useFetchSchoolDetails(
    user ? user.school.id : null
  );
  const isLoadingAuthenticatedUserData = React.useMemo(
    () => isEmpty(state.user) || isAuthenticating || isFetchingUser,
    [state.user, isAuthenticating, isFetchingUser]
  );
  const isLoadingAuthenticatedUserSchoolData = React.useMemo(
    () => isEmpty(state.school) || isAuthenticating || isFetchingSchool,
    [state.school, isAuthenticating, isFetchingSchool]
  );
  const shouldSetAuthenticatedUser = React.useMemo(
    () => !!user && isEmpty(state.user),
    [user, state.user]
  );
  const shouldSetAuthenticatedUserSchool = React.useMemo(
    () => !!school && isEmpty(state.school),
    [school, state.school]
  );
  const isReady = React.useMemo(
    () =>
      !isLoadingAuthenticatedUserData && !isLoadingAuthenticatedUserSchoolData,
    [isLoadingAuthenticatedUserData, isLoadingAuthenticatedUserSchoolData]
  );
  const [nav, setNav] = React.useState(<NavSilhouette />);
  const [routes, setRoutes] = React.useState(<SilhouetteRoutes />);
  const [footer, setFooter] = React.useState(<Empty />);
  const timezone = React.useMemo(
    () => (isReady ? state.user.timezone : undefined),
    [isReady, state.user.timezone]
  );

  React.useEffect(() => {
    if (!!timezone) {
      LuxonSettings.defaultZoneName = timezone;
    }
  }, [timezone]);

  React.useEffect(() => {
    if (shouldSetAuthenticatedUser) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: user
      });
    }
  }, [dispatch, shouldSetAuthenticatedUser, user]);

  React.useEffect(() => {
    if (shouldSetAuthenticatedUserSchool) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [dispatch, shouldSetAuthenticatedUserSchool, school]);

  React.useEffect(() => {
    if (isReady) {
      setNav(<AuthenticatedNav />);
      setRoutes(<Routes />);
      setFooter(<Footer />);
    }
  }, [isReady]);

  return (
    <React.Fragment>
      <VerifyEmailReminderBanner />
      {nav}
      <Box as="main" pb={12} bg="#fdfdfd" minH="100vh" h="100%">
        {routes}
      </Box>
      {footer}
    </React.Fragment>
  );
};

const SilhouetteRoutes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Empty path="/" />
        <Empty path="about-us" />
        <Empty path="frequently-asked-questions" />
        <Empty path="auth-action" />
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
        <AboutUs path="about-us" />
        <FrequentlyAskedQuestions path="frequently-asked-questions" />
        <AuthAction path="auth-action" />
        <EditUser path="edit-user" />
        <User path="user/:id" />
        <School path="school/:id" />
        <EditSchool path="school/:id/edit" edit={true} />
        <CreateEvent path="create-event" />
        <Event path="event/:id" />
        <CreateEvent path="event/:id/edit" edit={true} />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default AuthenticatedApp;
