import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Button,
  useToast
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";

import { firebaseAuth } from "../firebase";

const VerifyEmailReminderBanner = () => {
  const toast = useToast();
  const [authenticatedUser] = useAuthState(firebaseAuth);

  const sendEmailVerification = () => {
    firebaseAuth.currentUser.sendEmailVerification().then(
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

  if (firebaseAuth.currentUser.emailVerified) {
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
            variantColor="blue"
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
