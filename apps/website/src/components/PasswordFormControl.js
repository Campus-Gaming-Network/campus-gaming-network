// Libraries
import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useBoolean,
} from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// PasswordFormControl

const PasswordFormControl = (props) => {
  const [isShowingPassword, setIsShowingPassword] = useBoolean();

  return (
    <FormControl isRequired isInvalid={props.errors.password}>
      <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
        {props.label || "Password"}
      </FormLabel>
      <Input
        id="password"
        name="password"
        type={isShowingPassword ? "text" : "password"}
        placeholder="******************"
        onChange={props.onChange}
        value={props.value}
        size="lg"
      />
      {props.withVisibilityToggle ? (
        <Button
          onClick={setIsShowingPassword.toggle}
          fontSize="sm"
          fontStyle="italic"
          variant="link"
          fontWeight="normal"
        >
          {isShowingPassword ? "Hide" : "Show"} password
        </Button>
      ) : null}
      <FormErrorMessage>{props.errors.password}</FormErrorMessage>
    </FormControl>
  );
};

export default PasswordFormControl;
