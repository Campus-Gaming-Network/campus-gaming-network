import React from "react";
import { Redirect } from "@reach/router";
import {
  Stack,
  Box,
  Button as ChakraButton,
  Heading,
  useToast
} from "@chakra-ui/core";
import { firebaseFirestore, firebaseAuth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppState } from "../store";

const EditEvent = props => {
  console.log({ props });
  const state = useAppState();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [event, setEvent] = React.useState(null);
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

  const getEvent = React.useCallback(() => {
    // if (!!cachedEvent) {
    //   setEvent(cachedEvent);
    // } else if (!eventFetchId) {
    //   setEventFetchId(props.id);
    // } else if (fetchedEvent) {
    //   setEvent(fetchedEvent);
    //   dispatch({
    //     type: ACTION_TYPES.SET_EVENT,
    //     payload: fetchedEvent
    //   });
    // }
  }, []);

  if (isAuthenticating) {
    return null;
  }

  if (!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  // if (!event) {
  //   console.error(`No event found ${props.uri}`);
  //   return <Redirect to="../../not-found" noThrow />;
  // }

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
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
