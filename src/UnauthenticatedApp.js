// Libraries
import React from "react";
import { Router } from "src/components/node_modules/@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box } from "@chakra-ui/react";

// Other
import { auth } from "src/firebase";

// Pages
import Home from "pages";
import School from "pages/school/[id]";
import User from "pages/user/[id]/[id]";
import Event from "pages/event/[id]";
import NotFound from "pages/404";
import Signup from "pages/signup";
import Login from "pages/login";
import AuthAction from "pages/auth-action";
import ForgotPassword from "pages/forgot-password";
import PasswordReset from "pages/password-reset";
import AboutUs from "pages/about-us";
import FrequentlyAskedQuestions from "pages/frequently-asked-questions";

// Components
import UnauthenticatedNav from "src/components/UnauthenticatedNav";
import ScrollToTop from "src/components/ScrollToTop";
import NavSilhouette from "src/components/silhouettes/NavSilhouette";
import UserSilhouette from "src/components/silhouettes/UserSilhouette";
import SchoolSilhouette from "src/components/silhouettes/SchoolSilhouette";
import EventSilhouette from "src/components/silhouettes/EventSilhouette";
import Empty from "src/components/Empty";
import Footer from "src/components/Footer";

const UnauthenticatedApp = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(auth);
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
