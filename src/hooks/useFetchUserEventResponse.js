import React from "react";
import firebase from "src/firebase";
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

      const eventDocRef = firebase
        .firestore()
        .collection(COLLECTIONS.EVENTS)
        .doc(eventId);
      const userDocRef = firebase
        .firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId);

      firebase
        .firestore()
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .where("event.ref", "==", eventDocRef)
        .where("user.ref", "==", userDocRef)
        .limit(1)
        .get()
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
