// Libraries
import React from "react";

// Components
import NavSilhouette from "src/components/silhouettes/NavSilhouette";
import AuthenticatedNav from "src/components/AuthenticatedNav";
import UnauthenticatedNav from "src/components/UnauthenticatedNav";

// Providers
import { useAuth } from "src/providers/auth";

const Nav = () => {
  const { authStatus, authUser, user, school } = useAuth();
  const isAuthenticated = React.useMemo(
    () => Boolean(authUser) && Boolean(authUser.uid),
    [authUser]
  );
  const hasUserData = React.useMemo(() => Boolean(user) && Boolean(school), [
    user,
    school
  ]);

  if (authStatus !== "finished") {
    return <NavSilhouette />;
  }

  if (isAuthenticated && hasUserData) {
    return <AuthenticatedNav user={user} school={school} />;
  }

  return <UnauthenticatedNav />;
};

export default Nav;
