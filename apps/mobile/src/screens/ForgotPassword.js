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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = React.useState("sansonebrandon@gmail.com");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const actionCodeSettings = {
        url: "https://campusgamingnetwork.page.link/auth-action",
        // url: `https://dev.campusgamingnetwork.com/auth-action`,
        // url: `https://campusgamingnetwork.page.link/auth-action?email=${email}`,
        android: {
          packageName: "com.cgn.mobile-dev",
          installApp: true,
          minimumVersion: "12",
        },
        handleCodeInApp: true,
        dynamicLinkDomain: "campusgamingnetwork.page.link",
      };
      console.log(actionCodeSettings);
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Something went wrong",
        status: "error",
        description: "Please create a support ticket from the support page",
      });
      setIsSubmitting(false);
      return;
    }

    toast.show({
      title: "Instructions Sent",
      status: "success",
      description: `Please check both the inbox and spam folder of the email ${email}.`,
    });
  };

  return (
    <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
      <Heading size="lg" fontWeight="bold" color="coolGray.800">
        Reset your password
      </Heading>
      <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
        Please enter the email you use for Campus Gaming Network below, and
        we’ll send you instructions on how to reset your password.
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
            Email
          </FormControl.Label>
          <Input type="email" onChangeText={(value) => setEmail(value)} />
        </FormControl>
        <Button
          isDisabled={isSubmitting}
          onPress={handleSubmit}
          mt="2"
          colorScheme="orange"
          _text={{ color: "white", fontWeight: "bold" }}
        >
          {isSubmitting ? "Sending..." : "Send Instructions"}
        </Button>
      </VStack>
    </Box>
  );
}
