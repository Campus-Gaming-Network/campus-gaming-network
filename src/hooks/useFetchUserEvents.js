import React from "react";
import isEmpty from "lodash.isempty";

import { firebase, firebaseFirestore } from "../firebase";
import { mapEventResponse } from "../utilities";
import { DEFAULT_EVENTS_LIST_PAGE_SIZE, COLLECTIONS } from "../constants";
import { useAppState } from "../store";

const useFetchUserEvents = (
  id,
  limit = DEFAULT_EVENTS_LIST_PAGE_SIZE,
  next = null,
  prev = null
) => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      setIsLoading(true);
      setEvents(null);
      setError(null);

      if (
        state.users[id] &&
        !isEmpty(state.users[id]) &&
        state.users[id].events &&
        !isEmpty(state.users[id].events)
      ) {
        console.log(`[CACHE] fetchUserEvents...${id}`);

        setEvents(state.users[id].events);
        setIsLoading(false);
      } else {
        console.log(`[API] fetchUserEvents...${id}`);

        const userDocRef = firebaseFirestore
          .collection(COLLECTIONS.USERS)
          .doc(id);
        const now = new Date();

        let query = firebaseFirestore
          .collection(COLLECTIONS.EVENT_RESPONSES)
          .where("user.ref", "==", userDocRef)
          .where("response", "==", "YES")
          .where(
            "event.endDateTime",
            ">=",
            firebase.firestore.Timestamp.fromDate(now)
          );

        if (next) {
          query = query.startAfter(next);
        } else if (prev) {
          query = query.startAt(prev);
        }

        query
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              let userEvents = [];

              snapshot.forEach(doc => {
                userEvents.push(mapEventResponse(doc.data(), doc));
              });

              setEvents(userEvents);
              setIsLoading(false);
            } else {
              setEvents([]);
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error({ error });
            setError(error);
            setIsLoading(false);
          });
      }
    };

    if (id) {
      fetchUserEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, limit, next, prev]);

  return [events, isLoading, error];
};

export default useFetchUserEvents;
