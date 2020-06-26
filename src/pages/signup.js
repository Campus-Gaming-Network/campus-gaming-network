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
import createFilterOptions from "react-select-fast-filter-options";
import VirtualizedSelect from "react-virtualized-select";

import * as constants from "../constants";

import { useFormFields, createGravatarHash } from "../utilities";

import Link from "../components/Link";

import { useAppState } from "../store";
import { firebaseFirestore, firebaseAuth } from "../firebase";

const Signup = () => {
  const state = useAppState();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    school: "",
    status: ""
  });
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);
  const schoolOptions = [
    { value: "", label: "Select your school" },
    ...Object.values(state.schools).map(school => ({
      value: school.id,
      label: startCase(school.name.toLowerCase())
    }))
  ];
  const schoolFilterOptions = createFilterOptions({ options: schoolOptions });

  if (authenticatedUser && !isAuthenticating) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = e => {
    e.preventDefault();

    setIsSubmitting(true);

    firebaseAuth
      .createUserWithEmailAndPassword(fields.email, fields.password)
      .then(({ user }) => {
        firebaseFirestore
          .collection("users")
          .doc(user.uid)
          .set({
            firstName: fields.firstName,
            lastName: fields.lastName,
            status: fields.status,
            gravatar: createGravatarHash(fields.email),
            school: firebaseFirestore.collection("schools").doc(fields.school)
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
              onChange={handleFieldChange}
              value={fields.firstName}
              size="lg"
              borderWidth={2}
              borderColor="gray.300"
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
              onChange={handleFieldChange}
              value={fields.lastName}
              size="lg"
              borderWidth={2}
              borderColor="gray.300"
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
              onChange={handleFieldChange}
              value={fields.email}
              size="lg"
              aria-describedby="email-helper-text"
              borderWidth={2}
              borderColor="gray.300"
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
              onChange={handleFieldChange}
              value={fields.password}
              size="lg"
              borderWidth={2}
              borderColor="gray.300"
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
          <FormControl isRequired>
            <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
              School
            </FormLabel>
            <VirtualizedSelect
              id="school"
              name="school"
              onChange={value =>
                handleFieldChange({
                  target: {
                    id: "school",
                    value
                  }
                })
              }
              value={fields.school}
              size="lg"
              borderWidth={2}
              borderColor="gray.300"
              filterOptions={schoolFilterOptions}
              options={schoolOptions}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
              Status
            </FormLabel>
            <Select
              id="status"
              name="status"
              onChange={handleFieldChange}
              value={fields.status}
              size="lg"
              borderWidth={2}
              borderColor="gray.300"
            >
              {constants.STUDENT_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {startCase(status.label)}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
          <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
            Log in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Signup;
