// Libraries
import React from "react";

// Other
import firebase from "src/firebase";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchUserCreatedEvents = (id, limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserCreatedEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchUserCreatedEvents...${id}`);
      }

      const userDocRef = firebase
        .firestore()
        .collection(COLLECTIONS.USERS)
        .doc(id);
      const now = new Date();

      let _events = [];

      try {
        const userCreatedEventsSnapshot = await firebaseAdmin
          .firestore()
          .collection("events")
          .where("creator", "==", userDocRef)
          .where(
            "endDateTime",
            ">=",
            firebaseAdmin.firestore.Timestamp.fromDate(now)
          )
          .limit(25)
          .get();

        if (!userCreatedEventsSnapshot.empty) {
          userCreatedEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = mapEvent({ id: doc.id, ...data }, doc);
            _events.push(event);
          });
        }

        setState(STATES.DONE);
        setEvents(_events);
      } catch (error) {
        console.error({ error });
        setError(error);
        setState(STATES.ERROR);
      }
    };

    if (id) {
      fetchUserCreatedEvents();
    }
  }, [id, limit]);

  return [events, state, error];
};

export default useFetchUserCreatedEvents;
