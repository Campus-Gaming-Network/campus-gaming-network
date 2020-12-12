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

// Constants
import { EVENT_RESPONSES } from "../../constants";

const RSVPDialog = props => {
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const hasResponded = React.useMemo(() => !!props.eventResponse, [
    props.eventResponse
  ]);

  if (hasResponded && props.eventResponse.response === EVENT_RESPONSES.NO) {
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
              {props.event ? props.event.name : ""}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {props.isSubmitting ? (
              <Button colorScheme="brand" disabled={true}>
                RSVPing...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={attendRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => props.onConfirm(EVENT_RESPONSES.YES)}
                  ml={3}
                >
                  Yes, I want to go
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (
    hasResponded &&
    props.eventResponse.response === EVENT_RESPONSES.YES
  ) {
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
              {props.event ? props.event.name : ""}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {props.isSubmitting ? (
              <Button colorScheme="red" disabled={true}>
                Cancelling...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={cancelRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => props.onConfirm(EVENT_RESPONSES.NO)}
                  ml={3}
                >
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
