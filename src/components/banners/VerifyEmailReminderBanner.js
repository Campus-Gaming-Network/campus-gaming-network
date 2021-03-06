import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Button,
  useToast
} from "@chakra-ui/react";

import firebase from "src/firebase";
import { useAuth } from "src/providers/auth";

const VerifyEmailReminderBanner = () => {
  const auth = useAuth();
  const toast = useToast();
  const hasAuthUser = Boolean(auth) && Boolean(auth.authUser);
  const email = hasAuthUser ? auth.authUser.email : null;
  const [sendingStatus, setSendingStatus] = React.useState("idle");

  const sendEmailVerification = () => {
    if (!email || sendingStatus !== "sending") {
      return;
    }

    setSendingStatus("sending");

    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(
        () => {
          toast({
            title: "Verification email sent.",
            description: `A verification email has been sent to ${email}. Please check your inbox and follow the instructions in the email.`,
            status: "success",
            isClosable: true
          });
          setSendingStatus("sent");
        },
        error => {
          console.error(error);
          toast({
            title: "Error sending verification email.",
            description: `There was an error sending the verification email to ${email}. Please contact support.`,
            status: "error",
            isClosable: true
          });
          setSendingStatus("error");
        }
      );
  };

  if (!email || (hasAuthUser && auth.authUser.emailVerified)) {
    return null;
  }

  return (
    <Alert status="info">
      <AlertIcon />
      <AlertDescription>
        <Text>
          Your email{" "}
          <Text as="span" fontWeight="bold">
            {email}
          </Text>{" "}
          is not yet verified. Please verify your email address.{" "}
          <Button
            verticalAlign="baseline"
            onClick={sendEmailVerification}
            colorScheme="blue"
            variant="link"
          >
            Resend verification email
          </Button>
          .
        </Text>
      </AlertDescription>
    </Alert>
  );
};

export default VerifyEmailReminderBanner;
