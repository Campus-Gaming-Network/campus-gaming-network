// Libraries
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
  AlertDescription,
  FormErrorMessage
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import { useAuthState } from "react-firebase-hooks/auth";

// Utilities
import { useFormFields } from "../utilities";
import { validateForgotPassword } from "../utilities/validation";

// Components
import Link from "components/Link";

// Other
import { firebaseAuth } from "../firebase";

////////////////////////////////////////////////////////////////////////////////
// ForgotPassword

const ForgotPassword = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    email: ""
  });
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

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

    const { isValid, errors } = validateForgotPassword(fields);

    setErrors(errors);

    if (!isValid) {
      setIsSendingEmail(false);
      window.scrollTo(0, 0);
      return;
    }

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
      {hasErrors ? (
        <Alert status="error" mb={4} rounded="lg">
          <AlertIcon />
          <AlertDescription>
            There are errors in the form below. Please review and correct before
            submitting again.
          </AlertDescription>
        </Alert>
      ) : null}
      <Box
        as="form"
        borderWidth={1}
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
                Please check both the inbox and spam folder of the email{" "}
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
              <FormControl isRequired isInvalid={errors.email}>
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
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
            </Stack>
            <Button
              colorScheme="orange"
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
            <Link to="/login" color="orange.500" fontWeight={600}>
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
