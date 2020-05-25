import React from "react";
import { Redirect } from "@reach/router";
import { Box, Alert, AlertIcon } from "@chakra-ui/core";
import * as constants from "../constants";
import { useFormFields } from "../utilities";
import Flex from "../components/Flex";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import Link from "../components/Link";
import { firebaseAuth } from "../firebase";

const ForgotPassword = props => {
  const [fields, handleFieldChange] = useFormFields({
    confirmationCode: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    setIsSendingCode(true);

    try {
      // TODO:
      const response = firebaseAuth.sendPasswordResetEmail(fields.email);
      console.log("response", response);
      setCodeSent(true);
    } catch (e) {
      // TODO:
      alert(e.message);
      setIsSendingCode(false);
    }
  };

  const handleConfirmationSubmit = async e => {
    e.preventDefault();

    setIsConfirming(true);

    try {
      // TODO:
      // await Auth.forgotPasswordSubmit(
      //   fields.email,
      //   fields.confirmationCode,
      //   fields.password
      // );
      setConfirmed(true);
    } catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  };

  const validateCodeForm = () => {
    return fields.email.length > 0;
  };

  const validateResetForm = () => {
    return (
      fields.confirmationCode.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  };

  if (codeSent) {
    if (confirmed) {
      return (
        <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
          <Alert status="success" variant="subtle">
            <span className="font-bold block text-2xl">
              Your password has been reset.
            </span>
            <p>
              <Link to="/login" className="hover:underline focus:underline">
                Click here to login with your new credentials.
              </Link>
            </p>
          </Alert>
        </Box>
      );
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
          <form onSubmit={handleConfirmationSubmit}>
            <Alert status="warning" variant="sbutle">
              <AlertIcon />
              Please check your email ({fields.email}) for instructions on
              resetting your password.
            </Alert>
          </form>
        </Box>
      </Box>
    );
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
            Reset your password
          </h1>
          <p className="text-gray-600">
            Enter the email you use for Campus Gaming Network, and we’ll help
            you create a new password.
          </p>
          <hr className="my-12" />
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jdoe123@gmail.com"
              required
              onChange={handleFieldChange}
              value={fields.email}
            />
          </div>
          <Button
            disabled={isSendingCode || !validateCodeForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isSendingCode ? "Sending..." : "Send Confirmation"}
          </Button>
          <Flex itemsCenter justifyBetween>
            <p>
              Go back to{" "}
              <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
                Login page
              </Link>
              .
            </p>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
