// Libraries
import React from "react";
import { useToast } from "@chakra-ui/react";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";

// Other
import firebase from "src/firebase";

// Utilities
import { validateCreateEvent } from "src/utilities/validation";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DASHED_DATE_TIME } from "src/constants/dateTime";
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES } from "src/constants/other";

import EventForm from "src/components/EventForm";
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  try {
    const cookies = nookies.get(context);
    const token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// CreateEvent

const CreateEvent = () => {
  const { school } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const handleSubmit = async (e, formState) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { isValid, errors } = validateCreateEvent({
      ...formState,
      startDateTime: DateTime.local(formState.startDateTime),
      endDateTime: DateTime.local(formState.endDateTime)
    });

    setErrors(errors);

    if (!isValid) {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
      return;
    }

    // TODO:
    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(formState.location)
      .then(results => {
        console.log({ results });
      })
      .catch(error => {
        console.error({ error });
      });

    let startDateTime = "";
    let endDateTime = "";

    if (
      formState.startMonth &&
      formState.startDay &&
      formState.startYear &&
      formState.startTime
    ) {
      const formattedStartdate = DateTime.fromFormat(
        `${formState.startMonth}-${formState.startDay}-${formState.startYear} ${formState.startTime}`,
        DASHED_DATE_TIME
      );
      startDateTime = firebase.firestore.Timestamp.fromDate(
        new Date(formattedStartdate)
      );
    }

    if (
      formState.endMonth &&
      formState.endDay &&
      formState.endYear &&
      formState.endTime
    ) {
      const formattedEnddate = DateTime.fromFormat(
        `${formState.endMonth}-${formState.endDay}-${formState.endYear} ${formState.endTime}`,
        DASHED_DATE_TIME
      );
      endDateTime = firebase.firestore.Timestamp.fromDate(
        new Date(formattedEnddate)
      );
    }

    const schoolDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(school.id);
    const userDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.USERS)
      .doc(user.id);

    const eventData = {
      creator: userDocRef,
      name: formState.name.trim(),
      description: formState.description.trim(),
      isOnlineEvent: formState.isOnlineEvent,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      game: formState.game
    };

    if (!formState.isOnlineEvent) {
      eventData.location = formState.location;
      eventData.placeId = formState.placeId;
    }

    eventData.school = {
      ref: schoolDocRef,
      id: schoolDocRef.id,
      name: school.name
    };

    let eventId;

    firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .add({
        ...eventData,
        responses: {
          yes: 0,
          no: 0
        }
      })
      .then(eventDocRef => {
        eventId = eventDocRef.id;

        firebase
          .firestore()
          .collection(COLLECTIONS.EVENTS)
          .doc(eventId)
          .update({ id: eventId })
          .catch(() => {
            setIsSubmitting(false);
          });

        const eventResponseData = {
          response: "YES",
          user: {
            ref: userDocRef,
            id: userDocRef.id,
            firstName: user.firstName,
            lastName: user.lastName,
            gravatar: user.gravatar
          },
          event: {
            ref: eventDocRef,
            id: eventDocRef.id,
            name: formState.name.trim(),
            description: formState.description.trim(),
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            game: formState.game,
            isOnlineEvent: formState.isOnlineEvent
          },
          school: {
            ref: schoolDocRef,
            id: schoolDocRef.id,
            name: school.name
          }
        };

        firebase
          .firestore()
          .collection(COLLECTIONS.EVENT_RESPONSES)
          .add(eventResponseData)
          .then(() => {
            toast({
              title: "Event created.",
              description:
                "Your event has been created. You will be redirected...",
              status: "success",
              isClosable: true
            });
            setTimeout(() => {
              router.push(`/event/${eventId}`);
            }, 2000);
          })
          .catch(() => {
            setIsSubmitting(false);
          });
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          isClosable: true
        });
      });
  };

  return (
    <EventForm
      state="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};

export default CreateEvent;
