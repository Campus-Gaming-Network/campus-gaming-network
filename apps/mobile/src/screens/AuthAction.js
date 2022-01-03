import React from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  useToast,
} from "native-base";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthAction({ navigation }) {
  const toast = useToast();
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {};

  return (
    <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
      <Heading size="lg" fontWeight="bold" color="coolGray.800">
        Password Reset
      </Heading>
      <VStack space={3} mt="5">
        <FormControl isRequired>
          <FormControl.Label
            _text={{
              color: "coolGray.800",
              fontSize: "xs",
              fontWeight: 500,
            }}
          >
            Password
          </FormControl.Label>
          <Input type="password" onChangeText={(value) => setPassword(value)} />
        </FormControl>
        <Button
          isDisabled={isSubmitting}
          onPress={handleSubmit}
          mt="2"
          colorScheme="orange"
          _text={{ color: "white", fontWeight: "bold" }}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </VStack>
    </Box>
  );
}
