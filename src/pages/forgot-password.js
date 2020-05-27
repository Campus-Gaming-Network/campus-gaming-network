import React from "react";
import { Redirect } from "@reach/router";
import {
  Box,
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Text,
  Divider,
  Input,
  Stack,
  FormLabel,
  FormControl,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";

import * as constants from "../constants";

import { useFormFields } from "../utilities";

import Link from "../components/Link";

import { firebaseAuth } from "../firebase";

const ForgotPassword = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    confirmationCode: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  if (isAuthenticating) {
    return null;
  }

  if (!!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    setIsSendingEmail(true);

    try {
      await firebaseAuth.sendPasswordResetEmail(fields.email);
      setEmailSent(true);
    } catch (e) {
      alert(e.message);
      setIsSendingEmail(false);
    }
  };

  const handleConfirmationSubmit = async e => {
    e.preventDefault();

    setIsConfirming(true);

    try {
      // TODO:
      // await Auth.forgotPasswordSubmit(
      //   fields.email,
      //   fields.confirmationCode,
      //   fields.password
      // );
      setConfirmed(true);
    } catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  };

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Box
        as="form"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
        onSubmit={handleSubmit}
      >
        <Heading as="h1" size="2xl" mb={4}>
          Reset your password
        </Heading>
        <Text color="gray.500">
          Please enter the email you use for Campus Gaming Network below, and
          we’ll send you instructions on how to reset your password.
        </Text>
        <Divider borderColor="gray.300" mt={12} mb={10} />
        {emailSent ? (
          <Alert status="info" mb={12}>
            <Stack>
              <Flex align="center">
                <AlertIcon />
                <AlertTitle>Instructions sent.</AlertTitle>
              </Flex>
              <AlertDescription>
                Please check the inbox of sansonebrandon@gmail.com.
              </AlertDescription>
            </Stack>
          </Alert>
        ) : (
          <React.Fragment>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                  Email:
                </FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jdoe123@gmail.com"
                  onChange={handleFieldChange}
                  value={fields.email}
                  size="lg"
                  borderWidth={2}
                  borderColor="gray.300"
                />
              </FormControl>
            </Stack>
            <Button
              variantColor="purple"
              type="submit"
              size="lg"
              w="full"
              isDisabled={isSendingEmail}
              isLoading={isSendingEmail}
              loadingText="Sending..."
              my={12}
            >
              Send Instructions
            </Button>
          </React.Fragment>
        )}
        <Flex align="center" justify="between">
          <Text>
            Go back to{" "}
            <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
              Login page
            </Link>
            .
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
