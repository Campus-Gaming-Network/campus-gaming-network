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

const useFetchUserEvents = (id, page, _limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchUserEvents...${id}`);
      }

      let _events = [];
      let queryArgs = [
        collection(db, COLLECTIONS.EVENT_RESPONSES),
        where("user.ref", "==", doc(db, COLLECTIONS.USERS, id)),
        where("response", "==", "YES"),
        where("event.endDateTime", ">=", Timestamp.fromDate(new Date())),
      ];

      if (page > 0) {
        if (!pages[page]) {
          queryArgs.push(startAfter(pages[page - 1].last));
        } else {
          queryArgs.push(startAt(pages[page].first));
        }
      }

      queryArgs.push(limit(_limit));

      try {
        const userEventsSnapshot = await getDocs(query(...queryArgs));

        if (!userEventsSnapshot.empty) {
          userEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = { ...mapEventResponse(data) };
            _events.push(event);
          });

          setPages((prev) => ({
            ...prev,
            ...{
              [page]: {
                first: userEventsSnapshot.docs[0],
                last:
                  userEventsSnapshot.docs[userEventsSnapshot.docs.length - 1],
              },
            },
          }));
        } else {
          setPages((prev) => ({
            ...prev,
            ...{
              [page]: {
                first: null,
                last: null,
              },
            },
          }));
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
