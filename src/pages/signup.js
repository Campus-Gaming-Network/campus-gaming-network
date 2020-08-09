import React from "react";
import { Redirect } from "@reach/router";
import startCase from "lodash.startcase";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Input as ChakraInput,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Button,
  Divider,
  Heading,
  FormHelperText
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import * as constants from "../constants";

import { createGravatarHash } from "../utilities";

import Link from "../components/Link";
import SchoolSelect from "../components/SchoolSelect";

import { firebaseFirestore, firebaseAuth } from "../firebase";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  school: "",
  status: ""
};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  };
};

const Signup = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (authenticatedUser && !isAuthenticating) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = e => {
    e.preventDefault();

    setIsSubmitting(true);

    firebaseAuth
      .createUserWithEmailAndPassword(formState.email, formState.password)
      .then(({ user }) => {
        firebaseFirestore
          .collection("users")
          .doc(user.uid)
          .set({
            firstName: formState.firstName,
            lastName: formState.lastName,
            status: formState.status,
            gravatar: createGravatarHash(formState.email),
            school: firebaseFirestore
              .collection("schools")
              .doc(formState.school)
          });
        setIsSubmitting(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setIsSubmitting(false);
        window.scrollTo(0, 0);
      });
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
        <Heading as="h1" size="2xl">
          Create an account
        </Heading>
        <Divider borderColor="gray.300" mt={12} mb={10} />
        {error ? (
          <Alert status="error" mb={12} rounded="lg">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <DetailSection
          handleFieldChange={handleFieldChange}
          firstName={formState.firstName}
          lastName={formState.lastName}
          email={formState.email}
          password={formState.password}
        />
        <SchoolSection
          handleFieldChange={handleFieldChange}
          school={formState.school}
          status={formState.status}
        />
        <Button
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Submitting..."
          my={12}
        >
          Sign Up
        </Button>
        <Text>
          Already a member?{" "}
          <Link to="/login" color="purple.500" fontWeight={600}>
            Log in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

const DetailSection = React.memo(props => {
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  return (
    <Stack spacing={6}>
      <FormControl isRequired>
        <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
          First Name
        </FormLabel>
        <ChakraInput
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Jane"
          onChange={props.handleFieldChange}
          value={props.firstName}
          size="lg"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
          Last Name
        </FormLabel>
        <ChakraInput
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Doe"
          onChange={props.handleFieldChange}
          value={props.lastName}
          size="lg"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
          Email
        </FormLabel>
        <ChakraInput
          id="email"
          name="email"
          type="email"
          placeholder="jdoe@gmail.com"
          onChange={props.handleFieldChange}
          value={props.email}
          size="lg"
          aria-describedby="email-helper-text"
        />
        <FormHelperText id="email-helper-text">
          This is how you will login.
        </FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
          Password
        </FormLabel>
        <ChakraInput
          id="password"
          name="password"
          type={isShowingPassword ? "text" : "password"}
          placeholder="******************"
          onChange={props.handleFieldChange}
          value={props.password}
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
  );
});

const SchoolSection = React.memo(props => {
  return (
    <Stack spacing={6} pt={6}>
      <FormControl isRequired>
        <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
          School
        </FormLabel>
        <SchoolSelect onChange={props.handleFieldChange} value={props.school} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
          Status
        </FormLabel>
        <Select
          id="status"
          name="status"
          onChange={props.handleFieldChange}
          value={props.status}
          size="lg"
        >
          {constants.STUDENT_STATUS_OPTIONS.map(status => (
            <option key={status.value} value={status.value}>
              {startCase(status.label)}
            </option>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
});

export default Signup;
