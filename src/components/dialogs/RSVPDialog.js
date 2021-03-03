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

// Other
import firebase from "src/firebase";

// Constants
import { EVENT_RESPONSES } from "src/constants/eventResponse";
import { COLLECTIONS } from "src/constants/firebase";

// Providers
import { useAuth } from "src/providers/auth";

const RSVPDialog = props => {
  const { authUser } = useAuth();
  const toast = useToast();
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const hasResponded = React.useMemo(() => Boolean(props.eventResponse), [
    props.eventResponse
  ]);

  const onAttendingAlertConfirm = async response => {
    setIsSubmitting(true);

    const data = getResponseFormData(response);

    if (!hasResponded) {
      firebase
        .firestore()
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .add(data)
        .then(() => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "RSVP created.",
            description: "Your RSVP has been created.",
            status: "success",
            isClosable: true
          });
          props.setRefreshEventResponse(!props.refreshEventResponse);
        })
        .catch(error => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            isClosable: true
          });
        });
    } else {
      firebase
        .firestore()
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .doc(props.eventResponse.id)
        .update({ response })
        .then(() => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "RSVP updated.",
            description: "Your RSVP has been updated.",
            status: "success",
            isClosable: true
          });
          props.setRefreshEventResponse(!props.refreshEventResponse);
        })
        .catch(error => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            isClosable: true
          });
        });
    }
  };

  const getResponseFormData = response => {
    const userDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.USERS)
      .doc(authUser.uid);
    const eventDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .doc(props.event.id);
    const schoolDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(props.event.school.id);
    // TODO
    const user = {};

    const data = {
      response,
      user: {
        id: userDocRef.id,
        ref: userDocRef,
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar
      },
      event: {
        id: eventDocRef.id,
        ref: eventDocRef,
        name: props.event.name,
        description: props.event.description,
        startDateTime: props.event.startDateTime,
        endDateTime: props.event.endDateTime,
        isOnlineEvent: props.event.isOnlineEvent,
        responses: {
          yes: 1,
          no: 0
        }
      },
      school: {
        id: schoolDocRef.id,
        ref: schoolDocRef,
        name: props.event.school.name
      }
    };

    return data;
  };

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
            {isSubmitting ? (
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
                  onClick={() => onAttendingAlertConfirm(EVENT_RESPONSES.YES)}
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
                  onClick={() => onAttendingAlertConfirm(EVENT_RESPONSES.NO)}
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
