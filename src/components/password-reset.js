// Libraries
import React from "react";
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
  FormErrorMessage,
  AlertDescription
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import { useRouter } from "next/router";
// import firebaseAdmin from "src/firebaseAdmin";
// import nookies from "nookies";

// Utilities
import { useFormFields } from "src/utilities/other";
import { validatePasswordReset } from "src/utilities/validation";

// Other
import firebase from "src/firebase";

// Constants
// import { AUTH_STATUS } from "src/constants/auth";
// import { COOKIES } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// PasswordReset

const PasswordReset = props => {
  const router = useRouter();
  const [fields, handleFieldChange] = useFormFields({
    password: ""
  });
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = async e => {
    e.preventDefault();

    setError(null);

    if (!props.oobCode) {
      return;
    }

    setIsChangingPassword(true);

    const { isValid, errors } = validatePasswordReset(fields);

    setErrors(errors);

    if (!isValid) {
      setIsChangingPassword(false);
      window.scrollTo(0, 0);
      return;
    }

    firebase
      .auth()
      .verifyPasswordResetCode(props.oobCode)
      .then(email => {
        firebase
          .auth()
          .confirmPasswordReset(props.oobCode, fields.password)
          .then(() => {
            firebase
              .auth()
              .signInWithEmailAndPassword(email, fields.password)
              .then(() => {
                router.push("/");
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
    <SiteLayout title="Password Reset">
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
          <Heading as="h2" size="2xl" mb={4}>
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
            <FormControl isRequired isInvalid={errors.password}>
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
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Button
            colorScheme="brand"
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
    </SiteLayout>
  );
};

export default PasswordReset;
