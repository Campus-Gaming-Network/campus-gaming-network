import React from "react";
import { Redirect } from "@reach/router";
import {
  Stack,
  Box,
  Button as ChakraButton,
  Heading,
  useToast
} from "@chakra-ui/core";
import { firebaseFirestore } from "../firebase";

const EditEvent = props => {
  console.log({ props });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const toast = useToast();

  const prefillForm = () => {
    setHasPrefilledForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!props.isAuthenticated) {
      return;
    }

    setIsSubmitting(true);

    firebaseFirestore
      .collection("events")
      .doc("6oMfIMOVayqG7jLtvgKl")
      .update({
        name: "brandon"
      })
      .then(() => {
        setIsSubmitting(false);
        toast({
          title: "Event updated.",
          description: "The eventhas been updated.",
          status: "success",
          isClosable: true
        });
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error,
          status: "error",
          isClosable: true
        });
      });

    setIsSubmitting(false);
  };

  if (props.isAuthenticating) {
    return null;
  }

  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  const shouldDisplaySilhouette = props.appLoading;

  if (shouldDisplaySilhouette) {
    return (
      <Box as="article" my={16} px={8} mx="auto" maxW="4xl">
        <Stack spacing={10}>
          <Box bg="gray.100" w="400px" h="60px" mb={4} borderRadius="md" />
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (!props.user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="not-found" noThrow />;
  }

  if (!hasPrefilledForm) {
    prefillForm();
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Edit Event
        </Heading>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Event"}
        </ChakraButton>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Event"}
        </ChakraButton>
      </Stack>
    </Box>
  );
};

export default EditEvent;
