// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import { sendEmailVerification } from "firebase/auth";

// Other
import { auth } from "src/firebase";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// VerifyEmailReminderBanner

const VerifyEmailReminderBanner = () => {
  const { authUser } = useAuth();
  const toast = useToast();
  const hasAuthUser = Boolean(authUser);
  const email = hasAuthUser ? authUser.email : null;
  const [sendingStatus, setSendingStatus] = React.useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || sendingStatus === "sending") {
      return;
    }

    setSendingStatus("sending");

    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: "Verification email sent.",
        description: `A verification email has been sent to ${email}. Please check your inbox and follow the instructions in the email.`,
        status: "success",
        isClosable: true,
      });
      setSendingStatus("sent");
    } catch (error) {
      toast({
        title: "Error sending verification email.",
        description:
          error.message ||
          `There was an error sending the verification email to ${email}. Please contact support.`,
        status: "error",
        isClosable: true,
      });
      setSendingStatus("error");
    }
  };

  if (!email || (hasAuthUser && authUser.emailVerified)) {
    return null;
  }

  return (
    <Alert status="info">
      <AlertIcon />
      <AlertDescription as="form" onSubmit={handleSubmit}>
        <Text>
          Your email{" "}
          <Text as="span" fontWeight="bold">
            {email}
          </Text>{" "}
          is not yet verified. Please verify your email address.{" "}
          <Button
            verticalAlign="baseline"
            type="submit"
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
