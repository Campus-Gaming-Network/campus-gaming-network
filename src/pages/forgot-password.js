import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Box, Alert } from "@chakra-ui/core";
import * as constants from "./constants";
import { useFormFields } from "./utilities";
import PageWrapper from "../components/PageWrapper";

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

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    } catch (e) {
      alert(e.message);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.confirmationCode,
        fields.password
      );
      setConfirmed(true);
    } catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  }

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.confirmationCode.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  if (codeSent) {
    if (confirmed) {
      return (
        <PageWrapper>
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
        </PageWrapper>
      );
    }

    return (
      <PageWrapper>
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
              <p className="font-medium">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-4"
                />
                Please check your email ({fields.email}) for a confirmation
                code.
              </p>
            </Alert>
            <hr className="my-12" />
            <div className="md:flex md:items-center mb-6">
              <label
                className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-1/3"
                htmlFor="confirmationCode"
              >
                Confirmation Code
              </label>
              <Input
                id="confirmationCode"
                name="confirmationCode"
                placeholder="12345"
                required
                autoFocus
                type="tel"
                onChange={handleFieldChange}
                value={fields.confirmationCode}
              />
            </div>
            <div className="md:flex md:items-center mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.password}
              />
            </div>
            <div className="md:flex md:items-center mb-6">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.confirmPassword}
              />
            </div>
            <Button
              disabled={isConfirming || !validateResetForm()}
              variant="purple"
              type="submit"
              className="my-12 w-full"
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </Button>
          </form>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
};

export default ForgotPassword;
