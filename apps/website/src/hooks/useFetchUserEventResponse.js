// Libraries
import React from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Constants
import { COLLECTIONS } from "src/constants/firebase";

const useFetchUserEventResponse = (eventId, userId, refreshToggle) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [eventResponse, setEventResponse] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEventResponse = async () => {
      setIsLoading(true);
      setEventResponse(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log("[API] fetchUserEventResponse...");
      }

      getDocs(
        query(
          collection(db, COLLECTIONS.EVENT_RESPONSES),
          where("event.ref", "==", doc(db, COLLECTIONS.EVENTS, eventId)),
          where("user.ref", "==", doc(db, COLLECTIONS.USERS, userId)),
          where("response", "==", "YES"),
          where("endDateTime", ">=", Timestamp.fromDate(new Date())),
          limit(1)
        )
      )
        .then((snapshot) => {
          if (!snapshot.empty) {
            const [doc] = snapshot.docs;
            setEventResponse({
              id: doc.id,
              ref: doc,
              ...doc.data(),
            });
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (eventId && userId) {
      fetchUserEventResponse();
    }
  }, [eventId, userId, refreshToggle]);

  return [eventResponse, isLoading, error];
};

export default useFetchUserEventResponse;
