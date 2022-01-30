// Libraries
import React from "react";

// Components
import NavSilhouette from "src/components/silhouettes/NavSilhouette";
import AuthenticatedNav from "src/components/AuthenticatedNav";
import UnauthenticatedNav from "src/components/UnauthenticatedNav";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// Nav

const Nav = () => {
  const { isAuthenticated, isAuthenticating, user, school } = useAuth();

  if (isAuthenticating) {
    return <NavSilhouette />;
  }

  if (isAuthenticated) {
    return <AuthenticatedNav user={user} school={school} />;
  }

  return <UnauthenticatedNav />;
};

export default Nav;
