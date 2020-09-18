import React from "react";
import { Redirect } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import queryString from "query-string";

import Empty from "../components/Empty";

import PasswordReset from "./password-reset";

import { firebaseAuth } from "../firebase";

const AuthActionComponents = {
  resetPassword: PasswordReset,
  recoverEmail: null,
  verifyEmail: null
};

const AuthAction = props => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const { mode, oobCode } = React.useMemo(
    () => queryString.parse(props.location.search),
    [props.location.search]
  );
  const AuthActionComponent = React.useMemo(
    () =>
      mode && !!AuthActionComponents[mode] ? AuthActionComponents[mode] : Empty,
    [mode]
  );

  if (isAuthenticating) {
    return null;
  }

  if (!!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  return <AuthActionComponent {...{ ...props, mode, oobCode }} />;
};

export default AuthAction;
