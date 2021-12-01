// Libraries
import React from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchRecentlyCreatedEvents = (_limit = 25) => {
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

      let _events = [];

      try {
        const recentlyCreatedEventsSnapshot = await getDocs(
          query(
            collection(db, COLLECTIONS.EVENTS),
            where("endDateTime", ">=", Timestamp.fromDate(new Date())),
            orderBy("endDateTime"),
            orderBy("createdAt", "desc"),
            limit(_limit)
          )
        );

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
  }, [_limit]);

  return [events, state, error];
};

export default useFetchRecentlyCreatedEvents;
