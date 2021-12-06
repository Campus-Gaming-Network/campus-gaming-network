// Libraries
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
  AlertDialogOverlay,
  useBoolean,
} from "@chakra-ui/react";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Constants
import { EVENT_RESPONSES } from "src/constants/eventResponse";
import { COLLECTIONS } from "src/constants/firebase";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////
// RSVPDialog

const RSVPDialog = (props) => {
  const { authUser } = useAuth();
  const toast = useToast();
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const hasResponded = React.useMemo(() => Boolean(props.eventResponse), [
    props.eventResponse,
  ]);

  const handleSubmitError = (error) => {
    props.onClose();
    setIsSubmitting.off();
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const onAttendingAlertConfirm = async (response) => {
    setIsSubmitting.on();

    const data = getResponseFormData(response);

    if (!hasResponded) {
      try {
        await addDoc(collection(db, COLLECTIONS.EVENT_RESPONSES), data);
        toast({
          title: "RSVP created.",
          description: "Your RSVP has been created.",
          status: "success",
          isClosable: true,
        });
        window.location.reload();
      } catch (error) {
        handleSubmitError(error);
      }
    } else {
      try {
        await updateDoc(
          doc(db, COLLECTIONS.EVENT_RESPONSES, props.eventResponse.id),
          {
            response,
          }
        );
        toast({
          title: "RSVP updated.",
          description: "Your RSVP has been updated.",
          status: "success",
          isClosable: true,
        });
        window.location.reload();
      } catch (error) {
        handleSubmitError(error);
      }
    }
  };

  const getResponseFormData = (response) => {
    const userDocRef = doc(db, COLLECTIONS.USERS, authUser.uid);
    const eventDocRef = doc(db, COLLECTIONS.EVENTS, props.event.id);
    const schoolDocRef = doc(db, COLLECTIONS.SCHOOLS, props.event.school.id);

    console.log("props.event.startDateTime", props.event.startDateTime);
    console.log("props.event.endDateTime", props.event.endDateTime);

    const data = {
      response,
      user: {
        id: userDocRef.id,
        ref: userDocRef,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        gravatar: props.user.gravatar,
        status: props.user.status,
        school: {
          ref: props.user.school.ref,
          id: props.user.school.id,
          name: props.user.school.name,
        },
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
          no: 0,
        },
      },
      school: {
        id: schoolDocRef.id,
        ref: schoolDocRef,
        name: props.event.school.name,
      },
    };

    return data;
  };

  if (
    !hasResponded ||
    (hasResponded && props.eventResponse.response === EVENT_RESPONSES.NO)
  ) {
    return (
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader>RSVP for '{props.event.name}'</AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to RSVP for{" "}
            <Text as="span" fontWeight="bold">
              {props.event.name}
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
          <AlertDialogHeader>Cancel RSVP</AlertDialogHeader>

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
