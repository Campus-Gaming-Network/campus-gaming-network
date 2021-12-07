// Libraries
import React from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  limit,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapEventResponse } from "src/utilities/eventResponse";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchUserEvents = (id, _limit) => {
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

      let _events = [];

      try {
        const userEventsSnapshot = await getDocs(
          query(
            collection(db, COLLECTIONS.EVENT_RESPONSES),
            where("user.ref", "==", doc(db, COLLECTIONS.USERS, id)),
            where("response", "==", "YES"),
            where("event.endDateTime", ">=", Timestamp.fromDate(new Date())),
            limit(25)
          )
        );

        if (!userEventsSnapshot.empty) {
          userEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = { ...mapEventResponse(data) };
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
  }, [id, _limit]);

  return [events, state, error];
};

export default useFetchUserEvents;
