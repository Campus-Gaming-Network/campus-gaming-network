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
  Button as ChakraButton
} from "@chakra-ui/core";
import * as constants from "../constants";

import { useFormFields } from "../utilities";

import { firebaseAuth } from "../firebase";

import Flex from "../components/Flex";
import Link from "../components/Link";

const Login = props => {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
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
  }

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Box
        as="fieldset"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold leading-none mb-4">
            Welcome back!
          </h1>
          <p className="text-gray-600">Log in to your account</p>
          <hr className="mt-12 mb-10" />
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
              />
            </FormControl>
          </Stack>
          <ChakraButton
            variantColor="purple"
            type="submit"
            size="lg"
            w="full"
            disabled={isLoading || !validateForm()}
            my={12}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </ChakraButton>
          <Flex itemsCenter justifyBetween>
            <Text>
              Don’t have an account?{" "}
              <Link to="/register" className={constants.STYLES.LINK.DEFAULT}>
                Create one
              </Link>
            </Text>
            {/* TODO: Reimplment with firebase */}
            {/* <Link
              to="/forgot-password"
              className={`${constants.STYLES.LINK.DEFAULT}`}
            >
              Forgot your password?
            </Link> */}
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
