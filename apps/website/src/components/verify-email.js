// Libraries
import React from "react";
import { applyActionCode } from "firebase/auth";

// Other
import { auth } from "src/firebase";

// Components
import Article from "src/components/Article";
import SiteLayout from "src/components/SiteLayout";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "src/components/common";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail

const VerifyEmail = (props) => {
  const [verifyState, setVerifyState] = React.useState("idle");
  const [verificationError, setError] = React.useState("");

  const handleVerifyEmail = React.useCallback(() => {
    applyActionCode(auth, props.oobCode)
      .then(() => {
        setVerifyState("success");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setVerifyState("error");
      });
  }, [props.oobCode]);

  React.useEffect(() => handleVerifyEmail(), [props.oobCode]);

  if (verifyState === "idle") {
    return null;
  }

  return (
    <SiteLayout
      meta={{
        title: "Verify Email",
        og: { url: `${PRODUCTION_URL}/verify-email` },
      }}
      hideNav
      hideFooter
    >
      <Article>
        <Alert
          status={verifyState}
          variant="subtle"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon height="40px" width="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {verifyState === "success"
              ? "Email verified!"
              : "Email verification unsuccessful."}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {verifyState === "success"
              ? "Thank you for verifying your email address."
              : verificationError}
          </AlertDescription>
        </Alert>
      </Article>
    </SiteLayout>
  );
};

export default VerifyEmail;
