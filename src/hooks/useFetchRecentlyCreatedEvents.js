// Libraries
import React from "react";

// Other
import firebase from "src/firebase";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchRecentlyCreatedEvents = (limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchRecentlyCreatedEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log("[API] fetchRecentlyCreatedEvents...");
      }

      const now = new Date();

      let _events = [];

      try {
        const recentlyCreatedEventsSnapshot = await firebase
          .firestore()
          .collection(COLLECTIONS.EVENTS)
          .where(
            "endDateTime",
            ">=",
            firebase.firestore.Timestamp.fromDate(now)
          )
          .orderBy("endDateTime")
          .orderBy("createdAt", "desc")
          .get();

        if (!recentlyCreatedEventsSnapshot.empty) {
          recentlyCreatedEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = {
              ...mapEvent(
                { id: doc.id, _createdAt: data.createdAt.toDate(), ...data },
                doc
              ),
            };
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

    fetchRecentlyCreatedEvents();
  }, [limit]);

  return [events, state, error];
};

export default useFetchRecentlyCreatedEvents;
