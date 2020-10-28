// Libraries
import React from "react";
import queryString from "query-string";

// Components
import Empty from "components/Empty";

// Pages
import PasswordReset from "./password-reset";
import VerifyEmail from "./verify-email";

const AuthActionComponents = {
  resetPassword: PasswordReset,
  verifyEmail: VerifyEmail
};

////////////////////////////////////////////////////////////////////////////////
// AuthAction

const AuthAction = props => {
  const { mode, oobCode } = React.useMemo(
    () => queryString.parse(props.location.search),
    [props.location.search]
  );
  const AuthActionComponent = React.useMemo(
    () =>
      mode && !!AuthActionComponents[mode] ? AuthActionComponents[mode] : Empty,
    [mode]
  );

  return <AuthActionComponent {...{ ...props, mode, oobCode }} />;
};

export default AuthAction;
