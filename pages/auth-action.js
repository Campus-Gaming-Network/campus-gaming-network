// Libraries
import React from "react";
import safeJsonStringify from "safe-json-stringify";

// Constants
import { REDIRECT_HOME, AUTH_ACTION, AUTH_ACTIONS } from "src/constants/other";

// Components
import Empty from "src/components/Empty";
import PasswordReset from "src/components/password-reset";
import VerifyEmail from "src/components/verify-email";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const { mode, oobCode } = context.query;

  if (!Boolean(oobCode) || !Boolean(mode) || !AUTH_ACTIONS.includes(mode)) {
    return REDIRECT_HOME;
  }

  const data = {
    mode,
    oobCode,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// AuthAction

const AuthAction = (props) => {
  if (
    !Boolean(props.oobCode) ||
    !Boolean(props.mode) ||
    !AUTH_ACTIONS.includes(props.mode)
  ) {
    return <Empty />;
  }

  if (props.mode === AUTH_ACTION.VERIFY_EMAIL) {
    return <VerifyEmail mode={props.mode} oobCode={props.oobCode} />;
  } else if (props.mode === AUTH_ACTION.RESET_PASSWORD) {
    return <PasswordReset mode={props.mode} oobCode={props.oobCode} />;
  } else {
    return <Empty />;
  }
};

export default AuthAction;
