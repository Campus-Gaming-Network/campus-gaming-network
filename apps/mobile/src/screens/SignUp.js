import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
} from "native-base";

export default function SignUp({ navigation }) {
  return (
    <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
      <Heading size="lg" fontWeight="bold" color="coolGray.800">
        Welcome
      </Heading>
      <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
        Sign up to continue!
      </Heading>
      <VStack space={3} mt="5">
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "xs", fontWeight: 500 }}
          >
            Email
          </FormControl.Label>
          <Input />
        </FormControl>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "xs", fontWeight: 500 }}
          >
            Password
          </FormControl.Label>
          <Input type="password" />
        </FormControl>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "xs", fontWeight: 500 }}
          >
            Confirm Password
          </FormControl.Label>
          <Input type="password" />
        </FormControl>
        <Button
          mt="2"
          colorScheme="orange"
          _text={{ color: "white", fontWeight: "bold" }}
        >
          Sign up
        </Button>
      </VStack>
    </Box>
  );
}
