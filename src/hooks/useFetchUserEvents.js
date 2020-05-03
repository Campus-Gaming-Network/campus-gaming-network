import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapEventResponse } from "../utilities";

const useFetchUserEvents = (id, limit = 25) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      console.log("fetchUserEvents...");

      const userDocRef = firebaseFirestore.collection("users").doc(id);

      setIsLoading(true);

      firebaseFirestore
        .collection("event-responses")
        .where("user", "==", userDocRef)
        .where("response", "==", "YES")
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let userEvents = [];
            snapshot.forEach(doc => {
              userEvents.push(mapEventResponse(doc.data(), doc));
            });
            console.log(userEvents);
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
  }, [id, limit]);

  return [events, isLoading, error];
};

export default useFetchUserEvents;
