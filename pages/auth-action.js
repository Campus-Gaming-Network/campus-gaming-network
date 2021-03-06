// Libraries
import React from "react";
import safeJsonStringify from "safe-json-stringify";

// Components
import Empty from "src/components/Empty";
import PasswordReset from "src/components/password-reset";
import VerifyEmail from "src/components/verify-email";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  const { mode, oobCode } = context.query;

  if (
    !Boolean(oobCode) ||
    !Boolean(mode) ||
    !["verifyEmail", "passwordReset"].includes(mode)
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  const data = {
    mode,
    oobCode
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// AuthAction

const AuthAction = props => {
  if (
    !Boolean(props.oobCode) ||
    !Boolean(props.mode) ||
    !["verifyEmail", "passwordReset"].includes(props.mode)
  ) {
    return <Empty />;
  }

  if (props.mode === "verifyEmail") {
    return <VerifyEmail mode={props.mode} oobCode={props.oobCode} />;
  } else if (props.mode === "resetPassword") {
    return <PasswordReset mode={props.mode} oobCode={props.oobCode} />;
  } else {
    return <Empty />;
  }
};

export default AuthAction;
