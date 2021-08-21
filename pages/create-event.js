// Libraries
import React from "react";
import { useBoolean, useToast } from "@chakra-ui/react";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import nookies from "nookies";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { validateCreateEvent } from "src/utilities/validation";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DASHED_DATE_TIME } from "src/constants/dateTime";
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, NOT_FOUND } from "src/constants/other";

// Components
import EventForm from "src/components/EventForm";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
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
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// CreateEvent

const CreateEvent = () => {
  const { user, school } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const toast = useToast();

  const handleSubmitError = (error) => {
    setIsSubmitting.off();
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleSubmit = async (e, formState) => {
    e.preventDefault();

    setIsSubmitting.on();

    const { isValid, errors } = validateCreateEvent({
      ...formState,
      startDateTime: DateTime.local(formState.startDateTime),
      endDateTime: DateTime.local(formState.endDateTime),
    });

    setErrors(errors);

    if (!isValid) {
      setIsSubmitting.off();
      window.scrollTo(0, 0);
      return;
    }

    // TODO:
    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(formState.location)
      .then((results) => {
        console.log({ results });
      })
      .catch((error) => {
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
      startDateTime = Timestamp.fromDate(new Date(formattedStartdate));
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
      endDateTime = Timestamp.fromDate(new Date(formattedEnddate));
    }

    const schoolDocRef = doc(db, COLLECTIONS.SCHOOLS, school.id);
    const userDocRef = doc(db, COLLECTIONS.USERS, user.id);

    const eventData = {
      creator: {
        id: userDocRef.id,
        ref: userDocRef,
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar,
        status: user.status,
        school: {
          ref: user.school.ref,
          id: user.school.id,
          name: user.school.name,
        },
      },
      name: formState.name.trim(),
      description: formState.description.trim(),
      isOnlineEvent: formState.isOnlineEvent,
      startDateTime,
      endDateTime,
      game: formState.game,
      location: formState.location,
      placeId: formState.placeId,
      school: {
        ref: schoolDocRef,
        id: schoolDocRef.id,
        name: school.name,
      },
      responses: {
        yes: 0,
        no: 0,
      },
    };

    let eventDocRef;

    try {
      eventDocRef = await addDoc(collection(db, COLLECTIONS.EVENTS), eventData);
    } catch (error) {
      handleSubmitError(error);
    }

    if (Boolean(eventDocRef)) {
      try {
        await updateDoc(doc(db, COLLECTIONS.EVENTS, eventDocRef.id), {
          id: eventDocRef.id,
        });
      } catch (error) {
        handleSubmitError(error);
      }

      const eventResponseData = {
        response: "YES",
        user: {
          ref: userDocRef,
          id: userDocRef.id,
          firstName: user.firstName,
          lastName: user.lastName,
          gravatar: user.gravatar,
          status: user.status,
          school: {
            ref: user.school.ref,
            id: user.school.id,
            name: user.school.name,
          },
        },
        event: {
          ref: eventDocRef,
          id: eventDocRef.id,
          name: formState.name.trim(),
          description: formState.description.trim(),
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          game: formState.game,
          isOnlineEvent: formState.isOnlineEvent,
        },
        school: {
          ref: schoolDocRef,
          id: schoolDocRef.id,
          name: school.name,
        },
      };

      try {
        await addDoc(
          collection(db, COLLECTIONS.EVENT_RESPONSES),
          eventResponseData
        );
        toast({
          title: "Event created.",
          description: "Your event has been created. You will be redirected...",
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/event/${eventDocRef.id}`);
        }, 2000);
      } catch (error) {
        handleSubmitError(error);
      }
    }
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
