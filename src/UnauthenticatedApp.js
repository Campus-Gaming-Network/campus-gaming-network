import React from "react";
import { Router } from "@reach/router";
import { firebaseAuth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Pages
import Home from "./pages";
import School from "./pages/school";
import User from "./pages/user";
import Event from "./pages/event";
import NotFound from "./pages/not-found";
import Signup from "./pages/signup";
import Login from "./pages/login";

// Components
import UnauthenticatedNav from "./components/UnauthenticatedNav";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import NavSilhouette from "./components/NavSilhouette";
import UserSilhouette from "./components/UserSilhouette";
import SchoolSilhouette from "./components/SchoolSilhouette";
import EventSilhouette from "./components/EventSilhouette";

const UnauthenticatedApp = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);

  return (
    <React.Fragment>
      <Header>
        {!authenticatedUser && isAuthenticating ? (
          <NavSilhouette />
        ) : (
          <UnauthenticatedNav />
        )}
      </Header>
      <main className="pb-12">
        {!authenticatedUser && isAuthenticating ? (
          <SilhouetteRoutes />
        ) : (
          <Routes />
        )}
      </main>
    </React.Fragment>
  );
};

const SilhouetteRoutes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Home path="/" />
        <UserSilhouette path="user/:id" />
        <SchoolSilhouette path="school/:id" />
        <EventSilhouette path="event/:id" />
        <Signup path="register" />
        <Login path="login" />
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
        <User path="user/:id" />
        <School path="school/:id" />
        <Event path="event/:id" />
        <Signup path="register" />
        <Login path="login" />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default UnauthenticatedApp;
