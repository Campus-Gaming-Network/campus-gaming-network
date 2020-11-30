// Libraries
import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect } from "@reach/router";

// Other
import { firebaseAuth } from "../firebase";

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail

const VerifyEmail = props => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [verifyState, setVerifyState] = React.useState("");
  const [verificationError, setError] = React.useState("");

  const handleVerifyEmail = React.useCallback(() => {
    firebaseAuth
      .applyActionCode(props.oobCode)
      .then(() => {
        firebaseAuth.currentUser
          .reload()
          .then(() => {
            if (firebaseAuth.currentUser.emailVerified) {
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

  React.useEffect(() => {
    if (!isAuthenticating && !!authenticatedUser) {
      handleVerifyEmail();
    }
  }, [isAuthenticating, authenticatedUser, handleVerifyEmail]);

  if (isAuthenticating) {
    return null;
  }

  if (!authenticatedUser) {
    return <Redirect to="/not-found" noThrow />;
  }

  if (!verifyState) {
    return null;
  }

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
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
    </Box>
  );
};

export default VerifyEmail;
