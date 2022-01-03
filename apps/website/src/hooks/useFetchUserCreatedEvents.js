// Libraries
import React from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  limit,
  Timestamp,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchUserCreatedEvents = (id) => {
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

      let _events = [];

      try {
        const userCreatedEventsSnapshot = await getDocs(
          query(
            collection(db, COLLECTIONS.EVENTS),
            where("creator", "==", doc(db, COLLECTIONS.USERS, id)),
            where("endDateTime", ">=", Timestamp.fromDate(new Date())),
            limit(25)
          )
        );

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
  }, [id]);

  return [events, state, error];
};

export default useFetchUserCreatedEvents;
