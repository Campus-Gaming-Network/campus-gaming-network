// Libraries
import React from "react";
import {
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
  FormErrorMessage,
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";
import { sendPasswordResetEmail } from "firebase/auth";

// Utilities
import { useFormFields } from "src/utilities/other";
import { validateForgotPassword } from "src/utilities/validation";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import Link from "src/components/Link";
import SiteLayout from "src/components/SiteLayout";

// Other
import { auth } from "src/firebase";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, PRODUCTION_URL, REDIRECT_HOME } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      return REDIRECT_HOME;
    }
  } catch (error) {
    return REDIRECT_HOME;
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// ForgotPassword

const ForgotPassword = () => {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
  });
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    setIsSendingEmail(true);

    const { isValid, errors } = validateForgotPassword(fields);

    setErrors(errors);

    if (!isValid) {
      setIsSendingEmail(false);
      window.scrollTo(0, 0);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, fields.email);
      setEmailSent(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
    setIsSendingEmail(false);
    window.scrollTo(0, 0);
  };

  return (
    <SiteLayout
      meta={{
        title: "Forgot Password",
        og: { url: `${PRODUCTION_URL}/forgot-password` },
      }}
    >
      <Article fullWidthMobile>
        {hasErrors ? (
          <Alert status="error" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              There are errors in the form below. Please review and correct
              before submitting again.
            </AlertDescription>
          </Alert>
        ) : null}
        <Card as="form" p={12} onSubmit={handleSubmit}>
          <Heading as="h2" size="2xl" mb={4}>
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
                colorScheme="brand"
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
              <Link href="/login" color="brand.500" fontWeight={600}>
                Login page
              </Link>
              .
            </Text>
          </Flex>
        </Card>
      </Article>
    </SiteLayout>
  );
};

export default ForgotPassword;
