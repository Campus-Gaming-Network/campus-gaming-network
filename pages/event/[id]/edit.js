// Libraries
import React from "react";
import { useToast, useBoolean } from "@chakra-ui/react";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import nookies from "nookies";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

// Other
import firebaseAdmin from "src/firebaseAdmin";
import { db } from "src/firebase";

// Utilities
import { validateCreateEvent } from "src/utilities/validation";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DASHED_DATE_TIME } from "src/constants/dateTime";
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, NOT_FOUND } from "src/constants/other";

// API
import { getEventDetails } from "src/api/event";

// Providers
import { useAuth } from "src/providers/auth";

// Components
import EventForm from "src/components/EventForm";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  let token;

  try {
    const cookies = nookies.get(context);
    token =
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

  const { event } = await getEventDetails(context.params.id);

  if (!Boolean(event)) {
    return NOT_FOUND;
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// EditEvent

const EditEvent = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useBoolean();

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

    const eventData = {
      creator: doc(db, COLLECTIONS.USERS, user.id),
      name: formState.name.trim(),
      description: formState.description.trim(),
      isOnlineEvent: formState.isOnlineEvent,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      game: formState.game,
      location: formState.location,
      placeId: formState.placeId,
    };

    updateDoc(doc(db, COLLECTIONS.EVENTS, props.id), eventData)
      .then(() => {
        toast({
          title: "Event updated.",
          description: "Your event has been updated. You will be redirected...",
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/event/${props.id}`);
        }, 2000);
      })
      .catch((error) => {
        setIsSubmitting.off();
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <EventForm
      state="edit"
      event={props.event}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};

export default EditEvent;
