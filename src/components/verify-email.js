// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";

// Other
import firebase from "src/firebase";

// Components
import Article from "src/components/Article";
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail

const VerifyEmail = props => {
  const [verifyState, setVerifyState] = React.useState("idle");
  const [verificationError, setError] = React.useState("");

  const handleVerifyEmail = React.useCallback(() => {
    firebase
      .auth()
      .applyActionCode(props.oobCode)
      .then(() => {
        firebase
          .auth()
          .currentUser.reload()
          .then(() => {
            if (firebase.auth().currentUser.emailVerified) {
              setVerifyState("success");
            } else {
              setVerifyState("error");
            }
          })
          .catch(error => {
            console.error(error);
            setError(error.message);
            setVerifyState("error");
          });
      })
      .catch(error => {
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
    <SiteLayout title="Verify Email" hideNav hideFooter>
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
