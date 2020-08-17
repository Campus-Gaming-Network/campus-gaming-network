import React from "react";
import { firebase, firebaseFirestore } from "../firebase";
import { mapEventResponse } from "../utilities";
import * as constants from "../constants";

const useFetchUserEvents = (
  id,
  limit = constants.DEFAULT_EVENTS_LIST_PAGE_SIZE,
  next = null,
  prev = null
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      setIsLoading(true);
      setEvents(null);
      setError(null);

      console.log("[API] fetchUserEvents...");

      const userDocRef = firebaseFirestore.collection("users").doc(id);
      const now = new Date();

      let query = firebaseFirestore
        .collection("event-responses")
        .where("user", "==", userDocRef)
        .where("response", "==", "YES")
        .where(
          "eventDetails.endDateTime",
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
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (id) {
      fetchUserEvents();
    }
  }, [id, limit, next, prev]);

  return [events, isLoading, error];
};

export default useFetchUserEvents;
