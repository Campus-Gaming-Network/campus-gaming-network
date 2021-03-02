// Libraries
import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";

// Other
import firebase from "src/firebase";

// Utilities
import { hasToken, getAuthStatus } from "src/utilities/auth";

// Constants
import { AUTH_STATUS } from "src/constants/auth";

// Components
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  try {
    const cookies = nookies.get(context);
    const token = hasToken(cookies)
      ? await firebaseAdmin.auth().verifyIdToken(cookies.token)
      : null;
    const authStatus = getAuthStatus(token);

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

  if (!verifyState) {
    return null;
  }

  return (
    <SiteLayout title="Verify Email">
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
    </SiteLayout>
  );
};

export default VerifyEmail;
