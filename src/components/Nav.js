// Libraries
import React from "react";

// Components
import AuthenticatedNav from "src/components/AuthenticatedNav";
import UnauthenticatedNav from "src/components/UnauthenticatedNav";

// Providers
import { useAuth } from "src/providers/auth";

const Nav = () => {
  const auth = useAuth();
  const isAuthenticated =
    Boolean(auth) && Boolean(auth.authUser) && Boolean(auth.authUser.uid);

  return isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />;
};

export default Nav;
