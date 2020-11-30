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
} from "@chakra-ui/core";

const RSVPDialog = props => {
  const cancelRef = React.useRef();
  const attendRef = React.useRef();

  if (props.eventResponse === "YES") {
    return (
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to RSVP for{" "}
            <Text as="span" fontWeight="bold">
              {props.eventName}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {props.isSubmitting ? (
              <Button variantColor="orange" disabled={true}>
                RSVPing...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={attendRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button variantColor="orange" onClick={props.onConfirm} ml={3}>
                  Yes, I want to go
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (props.eventResponse === "NO") {
    return (
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancel RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to cancel your RSVP for{" "}
            <Text as="span" fontWeight="bold">
              {props.eventName}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {props.isSubmitting ? (
              <Button variantColor="red" disabled={true}>
                Cancelling...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={cancelRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button variantColor="red" onClick={props.onConfirm} ml={3}>
                  Yes, cancel the RSVP
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return null;
  }
};

export default RSVPDialog;
