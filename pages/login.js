// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Button,
  Heading,
  Divider,
  Flex,
  FormErrorMessage,
  useBoolean,
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import { useRouter } from "next/router";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";
import { signInWithEmailAndPassword } from "firebase/auth";

// Utilities
import { useFormFields } from "src/utilities/other";
import { validateLogIn } from "src/utilities/validation";

// Other
import { auth } from "src/firebase";

// Components
import SiteLayout from "src/components/SiteLayout";
import Card from "src/components/Card";
import Article from "src/components/Article";
import Link from "src/components/Link";
import FormErrorAlert from "src/components/FormErrorAlert";

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
// Login

const Login = () => {
  const router = useRouter();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = useBoolean();
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    setIsLoading.on();

    const { isValid, errors } = validateLogIn(fields);

    setErrors(errors);

    if (!isValid) {
      setIsLoading.off();
      window.scrollTo(0, 0);
      return;
    }

    signInWithEmailAndPassword(auth, fields.email, fields.password)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setIsLoading.off();
        window.scrollTo(0, 0);
      });
  };

  return (
    <SiteLayout
      meta={{ title: "Login", og: { url: `${PRODUCTION_URL}/login` } }}
    >
      <Article fullWidthMobile>
        {hasErrors ? <FormErrorAlert /> : null}
        <Card as="form" p={12} onSubmit={handleSubmit}>
          <Heading as="h2" size="2xl">
            Welcome back!
          </Heading>
          <Text color="gray.500">Log in to your account</Text>
          <Divider borderColor="gray.300" mt={12} mb={10} />
          {error ? (
            <Alert status="error" mb={12} rounded="lg">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
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
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
                Password
              </FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******************"
                onChange={handleFieldChange}
                value={fields.password}
                size="lg"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Logging in..."
            my={12}
          >
            Log In
          </Button>
          <Flex alignItems="center" justifyContent="space-between">
            <Text>
              Don’t have an account?{" "}
              <Link href="/signup" color="brand.500" fontWeight={600}>
                Create one
              </Link>
            </Text>
            <Link href="/forgot-password" color="brand.500" fontWeight={600}>
              Forgot your password?
            </Link>
          </Flex>
        </Card>
      </Article>
    </SiteLayout>
  );
};

export default Login;
