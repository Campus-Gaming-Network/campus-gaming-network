// Libraries
import React from "react";
import startCase from "lodash.startcase";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Button,
  Divider,
  useToast,
  Heading,
  FormHelperText,
  FormErrorMessage
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import { useRouter } from "next/router";
import * as firebaseAdmin from "firebase-admin";
import nookies from "nookies";
import Head from "next/head";

// Constants
import { BASE_USER, STUDENT_STATUS_OPTIONS } from "src/constants/user";
import { COLLECTIONS } from "src/constants/firebase";
import { AUTH_STATUS } from "src/constants/auth";

// Utilities
import { createGravatarHash } from "src/utilities/user";
import { validateSignUp } from "src/utilities/validation";
import { hasToken, getAuthStatus } from "src/utilities/auth";

// Components
import Link from "src/components/Link";
import SchoolSearch from "src/components/SchoolSearch";

// Other
import { firebase } from "src/firebase";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  try {
    const cookies = nookies.get(context);
    const token = hasToken(cookies)
      ? await firebaseAdmin.auth().verifyIdToken(cookies.token)
      : null;
    const authStatus = getAuthStatus(token);

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

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

////////////////////////////////////////////////////////////////////////////////
// Signup

const Signup = () => {
  const router = useRouter();
  const toast = useToast();
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const onSchoolSelect = school => {
    formDispatch({ field: "school", value: school.id || "" });
  };
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = e => {
    e.preventDefault();

    setIsSubmitting(true);

    const { isValid, errors } = validateSignUp(formState);

    setErrors(errors);

    if (!isValid) {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(formState.email, formState.password)
      .then(({ user }) => {
        firebase
          .firestore()
          .collection(COLLECTIONS.USERS)
          .doc(user.uid)
          .set({
            ...BASE_USER,
            id: user.uid,
            firstName: formState.firstName,
            lastName: formState.lastName,
            status: formState.status,
            gravatar: createGravatarHash(formState.email),
            school: {
              ref: firebase
                .firestore()
                .collection(COLLECTIONS.SCHOOLS)
                .doc(formState.school),
              id: formState.school
            }
          });
        firebase
          .auth()
          .currentUser.sendEmailVerification()
          .then(
            () => {
              toast({
                title: "Verification email sent.",
                description: `A verification email has been sent to ${formState.email}. Please check your inbox and follow the instructions in the email.`,
                status: "success",
                isClosable: true
              });
            },
            error => {
              console.error(error);
            }
          );
        setIsSubmitting(false);
        router.push("/");
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setIsSubmitting(false);
        window.scrollTo(0, 0);
      });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Signup | CGN</title>
      </Head>
      <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
        {hasErrors ? (
          <Alert status="error" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              There are errors in the form below. Please review and correct
              before submitting again.
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
            errors={errors}
            firstName={formState.firstName}
            lastName={formState.lastName}
            email={formState.email}
            password={formState.password}
          />
          <SchoolSection
            handleFieldChange={handleFieldChange}
            errors={errors}
            status={formState.status}
            onSchoolSelect={onSchoolSelect}
          />
          <Button
            colorScheme="brand"
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
            <Link href="/login" color="brand.500" fontWeight={600}>
              Log in
            </Link>
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// DetailSection

const DetailSection = React.memo(props => {
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  return (
    <Stack spacing={6}>
      <FormControl isRequired isInvalid={props.errors.firstName}>
        <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
          First Name
        </FormLabel>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Jane"
          onChange={props.handleFieldChange}
          value={props.firstName}
          size="lg"
        />
        <FormErrorMessage>{props.errors.firstName}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={props.errors.lastName}>
        <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
          Last Name
        </FormLabel>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Doe"
          onChange={props.handleFieldChange}
          value={props.lastName}
          size="lg"
        />
        <FormErrorMessage>{props.errors.lastName}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={props.errors.email}>
        <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
          Email
        </FormLabel>
        <Input
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
        <FormErrorMessage>{props.errors.email}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={props.errors.password}>
        <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
          Password
        </FormLabel>
        <Input
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
        <FormErrorMessage>{props.errors.password}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
});

////////////////////////////////////////////////////////////////////////////////
// SchoolSection

const SchoolSection = React.memo(props => {
  return (
    <Stack spacing={6} pt={6}>
      <FormControl isRequired isInvalid={props.errors.school}>
        <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
          School
        </FormLabel>
        <SchoolSearch onSelect={props.onSchoolSelect} />
        <FormErrorMessage>{props.errors.school}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={props.errors.status}>
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
          {STUDENT_STATUS_OPTIONS.map(status => (
            <option key={status.value} value={status.value}>
              {startCase(status.label)}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{props.errors.status}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
});

export default Signup;
