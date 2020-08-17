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

import { useFormFields } from "../utilities";

import Link from "../components/Link";

import { firebaseAuth } from "../firebase";

const ForgotPassword = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    email: ""
  });
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (isAuthenticating) {
    return null;
  }

  if (!!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    setError(null);

    if (!!authenticatedUser) {
      return;
    }

    setIsSendingEmail(true);

    try {
      await firebaseAuth.sendPasswordResetEmail(fields.email);
      setEmailSent(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = error => {
    console.error(error);
    setError(error.message);
    setIsSendingEmail(false);
    window.scrollTo(0, 0);
  };

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
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
        {error ? (
          <Alert status="error" mb={12} rounded="lg">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {emailSent ? (
          <Alert status="info" mb={12} rounded="lg">
            <Stack>
              <Flex align="center">
                <AlertIcon />
                <AlertTitle>Instructions Sent</AlertTitle>
              </Flex>
              <AlertDescription>
                Please check both your inbox and spam folder for{" "}
                <Text fontWeight="bold" as="span">
                  sansonebrandon@gmail.com
                </Text>
                .
              </AlertDescription>
            </Stack>
          </Alert>
        ) : (
          <React.Fragment>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jdoe123@gmail.com"
                  onChange={handleFieldChange}
                  value={fields.email}
                  size="lg"
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
            <Link to="/login" color="purple.500" fontWeight={600}>
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
