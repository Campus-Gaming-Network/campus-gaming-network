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
import * as firebaseAdmin from "firebase-admin";
import nookies from "nookies";
import Head from "next/head";

// Other
import { firebase } from "src/firebase";

import { AUTH_STATUS } from "src/constants/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  try {
    const cookies = nookies.get(context);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const authStatus = Boolean(token.uid)
      ? AUTH_STATUS.AUTHENTICATED
      : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail

const VerifyEmail = props => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebase.auth());
  const [verifyState, setVerifyState] = React.useState("");
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

  React.useEffect(() => {
    if (!isAuthenticating && !!authenticatedUser) {
      handleVerifyEmail();
    }
  }, [isAuthenticating, authenticatedUser, handleVerifyEmail]);

  if (!verifyState) {
    return null;
  }

  return (
    <React.Fragment>
      <Head>
        <title>Verify Email | CGN</title>
      </Head>
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
    </React.Fragment>
  );
};

export default VerifyEmail;
