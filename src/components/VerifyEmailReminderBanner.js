import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Button,
  useToast
} from "@chakra-ui/react";

import { firebase } from "src/firebase";

const VerifyEmailReminderBanner = () => {
  const toast = useToast();

  const sendEmailVerification = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(
        () => {
          toast({
            title: "Verification email sent.",
            description: `A verification email has been sent to ${authenticatedUser.email}. Please check your inbox and follow the instructions in the email.`,
            status: "success",
            isClosable: true
          });
        },
        error => {
          console.error(error);
          toast({
            title: "Error sending verification email.",
            description: `There was an error sending the verification email to ${authenticatedUser.email}. Please contact support.`,
            status: "error",
            isClosable: true
          });
        }
      );
  };

  if (firebase.auth().currentUser.emailVerified) {
    return null;
  }

  return (
    <Alert status="info">
      <AlertIcon />
      <AlertDescription>
        <Text>
          Your email{" "}
          <Text as="span" fontWeight="bold">
            {authenticatedUser.email}
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
