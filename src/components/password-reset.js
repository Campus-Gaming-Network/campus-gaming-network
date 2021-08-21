// Libraries
import React from "react";
import {
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
  AlertDescription,
  useBoolean,
} from "@chakra-ui/react";
import isEmpty from "lodash.isempty";
import { useRouter } from "next/router";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Utilities
import { useFormFields } from "src/utilities/other";
import { validatePasswordReset } from "src/utilities/validation";

// Other
import { auth } from "src/firebase";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import SiteLayout from "src/components/SiteLayout";
import FormErrorAlert from "src/components/FormErrorAlert";

////////////////////////////////////////////////////////////////////////////////
// PasswordReset

const PasswordReset = (props) => {
  const router = useRouter();
  const [fields, handleFieldChange] = useFormFields({
    password: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useBoolean();
  const [isShowingPassword, setIsShowingPassword] = useBoolean();
  const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!props.oobCode) {
      return;
    }

    setIsChangingPassword.on();

    const { isValid, errors } = validatePasswordReset(fields);

    setErrors(errors);

    if (!isValid) {
      setIsChangingPassword.off();
      window.scrollTo(0, 0);
      return;
    }

    verifyPasswordResetCode(auth, props.oobCode)
      .then((email) => {
        confirmPasswordReset(auth, props.oobCode, fields.password)
          .then(() => {
            signInWithEmailAndPassword(auth, email, fields.password)
              .then(() => {
                router.push("/");
              })
              .catch((error) => {
                handleError(error);
              });
          })
          .catch((error) => {
            handleError(error);
          });
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
    setIsChangingPassword.off();
    window.scrollTo(0, 0);
  };

  return (
    <SiteLayout
      meta={{
        title: "Password Reset",
        og: { url: `${PRODUCTION_URL}/password-reset` },
      }}
    >
      <Article fullWidthMobile>
        {hasErrors ? <FormErrorAlert /> : null}
        <Card as="form" p={12} onSubmit={handleSubmit}>
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
                onClick={setIsShowingPassword.toggle}
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
        </Card>
      </Article>
    </SiteLayout>
  );
};

export default PasswordReset;
