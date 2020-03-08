import React from "react";
import { Redirect } from "@reach/router";
import sortBy from "lodash.sortby";
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
  Select as ChakraSelect,
  Button as ChakraButton
} from "@chakra-ui/core";
import * as constants from "../constants";
import { useFormFields, createGravatarHash } from "../utilities";
import Link from "../components/Link";
import { firebaseFirestore, firebaseAuth } from "../firebase";

const Signup = props => {
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
  const [schools, setSchools] = React.useState([]);
  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);

  // TODO: Impractical, we should use Algolia or ElasticSearch to query these
  React.useEffect(() => {
    const loadSchools = async () => {
      firebaseFirestore
        .collection("schools")
        .get()
        .then(snapshot => {
          setSchools(snapshot.docs);
          setSchoolOptions(
            sortBy(
              snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })),
              ["name"]
            )
          );
        });
    };

    loadSchools();
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
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
            school: schools.find(school => school.id === fields.school).ref
          });
        setIsSubmitting(false);
      })
      .catch(error => {
        setError(error.message);
        setIsSubmitting(false);
      });
  }

  function togglePasswordVisibility() {
    setIsShowingPassword(!isShowingPassword);
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
          <h1 className="text-5xl font-bold leading-none">Create an account</h1>
          <hr className="my-12" />
          {error ? (
            <Alert status="error" mb={12}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
                First Name:
              </FormLabel>
              <ChakraInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jane"
                onChange={handleFieldChange}
                value={fields.firstName}
                size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
                Last Name:
              </FormLabel>
              <ChakraInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                onChange={handleFieldChange}
                value={fields.lastName}
                size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                Email:
              </FormLabel>
              <ChakraInput
                id="email"
                name="email"
                type="email"
                placeholder="jdoe@gmail.com"
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
                type={isShowingPassword ? "text" : "password"}
                placeholder="******************"
                onChange={handleFieldChange}
                value={fields.password}
                size="lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-sm italic"
              >
                {isShowingPassword ? "Hide" : "Show"} password
              </button>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
                School:
              </FormLabel>
              <ChakraSelect
                id="school"
                onChange={handleFieldChange}
                value={fields.school}
                size="lg"
              >
                <option value="">Select a school</option>
                {schoolOptions.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
                Status:
              </FormLabel>
              <ChakraSelect
                id="status"
                onChange={handleFieldChange}
                value={fields.status}
                size="lg"
              >
                {constants.STUDENT_STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
          </Stack>
          <ChakraButton
            variantColor="purple"
            type="submit"
            size="lg"
            w="full"
            disabled={isSubmitting}
            my={12}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </ChakraButton>
          <Text>
            Already a member?{" "}
            <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
              Log in
            </Link>
          </Text>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
