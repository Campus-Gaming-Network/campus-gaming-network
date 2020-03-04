import React from "react";
import { Redirect, navigate } from "@reach/router";
import { Box } from "@chakra-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as constants from "./constants";
import { useFormFields } from "./utilities";
import PageWrapper from "../components/PageWrapper";
import Label from "../components/Label";
import Input from "../components/Input";

const Login = props => {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(fields.email, fields.password)
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        alert(error.message);
      });

    setIsLoading(false);
  }

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
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
            Welcome back!
          </h1>
          <p className="text-gray-600">Log in to your account</p>
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
          <div className="md:flex md:items-center">
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
          <Button
            disabled={isLoading || !validateForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
          <Flex itemsCenter justifyBetween>
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className={constants.STYLES.LINK.DEFAULT}>
                Create one
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className={`${constants.STYLES.LINK.DEFAULT}`}
            >
              Forgot your password?
            </Link>
          </Flex>
        </form>
      </Box>
    </PageWrapper>
  );
};

export default Login;
