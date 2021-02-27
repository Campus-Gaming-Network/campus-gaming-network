import React from "react";
import {
  Button,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react";
import { useRouter } from "next/router";

// Other
import { firebase } from "src/firebase";

// Constants
import { COLLECTIONS } from "src/constants/firebase";

const DeleteEventDialog = props => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const deleteEventRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onDeleteEventConfirm = async () => {
    setIsSubmitting(true);

    try {
      await firebase
        .firestore()
        .collection(COLLECTIONS.EVENTS)
        .doc(props.event.id)
        .delete();

      props.onClose();
      setIsSubmitting(false);
      toast({
        title: "Event deleted.",
        description: `Event ${props.event.name} has been deleted. You will be redirected...`,
        status: "success",
        isClosable: true
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      props.onClose();
      setIsSubmitting(false);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        isClosable: true
      });
    }
  };

  return (
    <AlertDialog
      isOpen={props.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={props.onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete Event
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to delete the event{" "}
          <Text as="span" fontWeight="bold">
            {props.event ? props.event.name : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled={true}>
              Deleting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={deleteEventRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" onClick={onDeleteEventConfirm} ml={3}>
                Yes, I want to delete the event
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEventDialog;
