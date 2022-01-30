// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Text,
  Divider,
  Input,
  Stack,
  FormLabel,
  FormControl,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
  useBoolean,
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";
import { sendPasswordResetEmail } from "firebase/auth";
import { validateForgotPassword } from "@campus-gaming-network/tools";

// Utilities
import { useFormFields } from "src/utilities/other";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import Link from "src/components/Link";
import SiteLayout from "src/components/SiteLayout";
import FormErrorAlert from "src/components/FormErrorAlert";
import { Heading } from "src/components/shared/Heading";

// Other
import { auth } from "src/firebase";

// Constants
import { COOKIES, PRODUCTION_URL, REDIRECT_HOME } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (Boolean(token?.uid)) {
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
  const [isSendingEmail, setIsSendingEmail] = useBoolean();
  const [emailSent, setEmailSent] = useBoolean();
  const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    setIsSendingEmail.on();

    const { error } = validateForgotPassword(fields);

    if (error) {
      const errors = error.details.reduce(
        (acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }),
        {}
      );
      setErrors(errors);
      setIsSendingEmail.off();
      window.scrollTo(0, 0);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, fields.email);
      setEmailSent.on();
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
    setIsSendingEmail.off();
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
        {hasErrors ? <FormErrorAlert /> : null}
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
