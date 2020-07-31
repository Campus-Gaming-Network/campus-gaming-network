import React from "react";
import { Redirect, navigate } from "@reach/router";
import {
  Box,
  Alert,
  AlertIcon,
  Button,
  Heading,
  Divider,
  Input,
  Stack,
  FormLabel,
  FormControl,
  AlertDescription
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import queryString from "query-string";

import { useFormFields } from "../utilities";

import { firebaseAuth } from "../firebase";

const PasswordReset = props => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    password: ""
  });
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);
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

    const { oobCode } = queryString.parse(props.location.search);

    if (!oobCode || !!authenticatedUser) {
      return;
    }

    setIsChangingPassword(true);

    firebaseAuth
      .verifyPasswordResetCode(oobCode)
      .then(email => {
        firebaseAuth
          .confirmPasswordReset(oobCode, fields.password)
          .then(() => {
            firebaseAuth
              .signInWithEmailAndPassword(email, fields.password)
              .then(() => {
                navigate("/");
              })
              .catch(error => {
                handleError(error);
              });
          })
          .catch(error => {
            handleError(error);
          });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const handleError = error => {
    console.error(error);
    setError(error.message);
    setIsChangingPassword(false);
    window.scrollTo(0, 0);
  };

  const togglePasswordVisibility = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
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
          Change Your Password
        </Heading>
        <Divider borderColor="gray.300" mt={12} mb={10} />
        {error ? (
          <Alert status="error" mb={12} rounded="lg">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Stack spacing={6}>
          <FormControl isRequired>
            <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
              New Password
            </FormLabel>
            <Input
              id="password"
              name="password"
              type={isShowingPassword ? "text" : "password"}
              placeholder="******************"
              onChange={handleFieldChange}
              value={fields.password}
              size="lg"
            />
            <Button
              onClick={togglePasswordVisibility}
              fontSize="sm"
              fontStyle="italic"
              variant="link"
              fontWeight="normal"
            >
              {isShowingPassword ? "Hide" : "Show"} password
            </Button>
          </FormControl>
        </Stack>
        <Button
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          isDisabled={isChangingPassword}
          isLoading={isChangingPassword}
          loadingText="Changing..."
          my={12}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordReset;
