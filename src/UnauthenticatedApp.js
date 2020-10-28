// Libraries
import React from "react";
import { Router } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box } from "@chakra-ui/core";

// Other
import { firebaseAuth } from "./firebase";

// Pages
import Home from "pages";
import School from "pages/school";
import User from "pages/user";
import Event from "pages/event";
import NotFound from "pages/not-found";
import Signup from "pages/signup";
import Login from "pages/login";
import AuthAction from "pages/auth-action";
import ForgotPassword from "pages/forgot-password";
import PasswordReset from "pages/password-reset";
import AboutUs from "pages/about-us";
import FrequentlyAskedQuestions from "pages/frequently-asked-questions";

// Components
import UnauthenticatedNav from "components/UnauthenticatedNav";
import ScrollToTop from "components/ScrollToTop";
import NavSilhouette from "components/NavSilhouette";
import UserSilhouette from "components/UserSilhouette";
import SchoolSilhouette from "components/SchoolSilhouette";
import EventSilhouette from "components/EventSilhouette";
import Empty from "components/Empty";
import Footer from "components/Footer";

const UnauthenticatedApp = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const isReady = React.useMemo(() => !isAuthenticating && !authenticatedUser, [
    isAuthenticating,
    authenticatedUser
  ]);
  const [nav, setNav] = React.useState(<NavSilhouette />);
  const [routes, setRoutes] = React.useState(<SilhouetteRoutes />);
  const [footer, setFooter] = React.useState(<Empty />);

  React.useEffect(() => {
    if (isReady) {
      setNav(<UnauthenticatedNav />);
      setRoutes(<Routes />);
      setFooter(<Footer />);
    }
  }, [isReady]);

  return (
    <React.Fragment>
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
        <Empty path="edit-user" />
        <UserSilhouette path="user/:id" />
        <SchoolSilhouette path="school/:id" />
        <Empty path="school/:id/edit" />
        <Empty path="create-event" />
        <EventSilhouette path="event/:id" />
        <Empty path="event/:id/edit" />
        <Empty path="register" />
        <Empty path="login" />
        <Empty path="forgot-password" />
        <Empty path="password-reset" />
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
        <User path="user/:id" />
        <School path="school/:id" />
        <Event path="event/:id" />
        <Signup path="register" />
        <Login path="login" />
        <ForgotPassword path="forgot-password" />
        <PasswordReset path="password-reset" />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default UnauthenticatedApp;
