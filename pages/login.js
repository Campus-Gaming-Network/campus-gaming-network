// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Button,
  Heading,
  Divider,
  Flex,
  FormErrorMessage
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";
import { useRouter } from 'next/router'

// Utilities
import { useFormFields } from "src/utilities/other";
import { validateLogIn } from "src/utilities/validation";

// Other
import { firebase } from "src/firebase";

// Components
import Link from "src/components/Link";

////////////////////////////////////////////////////////////////////////////////
// Login

const Login = () => {
  const router = useRouter()
  // const [authenticatedUser, isAuthenticating] = useAuthState(firebase.auth());
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  // if (authenticatedUser && !isAuthenticating) {
  //   router.push("/");
  //   return null;
  // }

  const handleSubmit = e => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    const { isValid, errors } = validateLogIn(fields);

    setErrors(errors);

    if (!isValid) {
      setIsLoading(false);
      window.scrollTo(0, 0);
      return;
    }

    firebase.auth()
      .signInWithEmailAndPassword(fields.email, fields.password)
      .then(() => {
        router.push("/")
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
        window.scrollTo(0, 0);
      });
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
          <FormControl isRequired isInvalid={errors.email}>
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
      </Box>
    </Box>
  );
};

export default Login;
