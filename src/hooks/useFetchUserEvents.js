// Libraries
import React from "react";

// Other
import firebase from "src/firebase";

// Utilities
import { mapEventResponse } from "src/utilities/eventResponse";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchUserEvents = (id, limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchUserEvents...${id}`);
      }

      const userDocRef = firebase
        .firestore()
        .collection(COLLECTIONS.USERS)
        .doc(id);
      const now = new Date();

      let _events = [];

      try {
        const userEventsSnapshot = await firebase
          .firestore()
          .collection(COLLECTIONS.EVENT_RESPONSES)
          .where("user.ref", "==", userDocRef)
          .where("response", "==", "YES")
          .where(
            "event.endDateTime",
            ">=",
            firebase.firestore.Timestamp.fromDate(now)
          )
          .get();

        if (!userEventsSnapshot.empty) {
          userEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = { ...mapEventResponse(data, doc) };
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
      fetchUserEvents();
    }
  }, [id, limit]);

  return [events, state, error];
};

export default useFetchUserEvents;
