import React from "react";
import {
  Button,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react";

const DeleteEventDialog = props => {
  const cancelRef = React.useRef();
  const deleteEventRef = React.useRef();

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
          {props.isSubmitting ? (
            <Button colorScheme="red" disabled={true}>
              Deleting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={deleteEventRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" onClick={props.onConfirm} ml={3}>
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
