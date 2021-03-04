// Libraries
import React from "react";
import { useRouter } from "next/router";

// Components
import Empty from "src/components/Empty";

// Pages
import PasswordReset from "pages/password-reset";
import VerifyEmail from "pages/verify-email";

const AuthActionComponents = {
  resetPassword: PasswordReset,
  verifyEmail: VerifyEmail
};

////////////////////////////////////////////////////////////////////////////////
// AuthAction

const AuthAction = props => {
  const router = useRouter();
  const { mode, oobCode } = router.query;
  const AuthActionComponent = React.useMemo(
    () =>
      mode && Boolean(AuthActionComponents[mode])
        ? AuthActionComponents[mode]
        : Empty,
    [mode]
  );

  return <AuthActionComponent {...{ ...props, mode, oobCode }} />;
};

export default AuthAction;
