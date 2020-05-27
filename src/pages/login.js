import React from "react";
import { Redirect, navigate } from "@reach/router";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Input as ChakraInput,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Button,
  Heading,
  Divider
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";

import * as constants from "../constants";

import { useFormFields } from "../utilities";

import { firebaseAuth } from "../firebase";

import Flex from "../components/Flex";
import Link from "../components/Link";

const Login = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (authenticatedUser && !isAuthenticating) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = e => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    firebaseAuth
      .signInWithEmailAndPassword(fields.email, fields.password)
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
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
        <Heading as="h1" size="2xl">
          Welcome back!
        </Heading>
        <Text color="gray.500">Log in to your account</Text>
        <Divider borderColor="gray.300" mt={12} mb={10} />
        {error ? (
          <Alert status="error" mb={12}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Stack spacing={6}>
          <FormControl isRequired>
            <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
              Email:
            </FormLabel>
            <ChakraInput
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
          <FormControl isRequired>
            <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
              Password:
            </FormLabel>
            <ChakraInput
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              onChange={handleFieldChange}
              value={fields.password}
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
          isDisabled={isLoading}
          isLoading={isLoading}
          loadingText="Logging in..."
          my={12}
        >
          Log In
        </Button>
        <Flex itemsCenter justifyBetween>
          <Text>
            Don’t have an account?{" "}
            <Link to="/register" className={constants.STYLES.LINK.DEFAULT}>
              Create one
            </Link>
          </Text>
          <Link
            to="/forgot-password"
            className={`${constants.STYLES.LINK.DEFAULT}`}
          >
            Forgot your password?
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default Login;
