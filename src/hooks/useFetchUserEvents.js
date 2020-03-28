import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchUserEvents = (id, limit = 25) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      console.log("fetchUserEvents...");
      setIsLoading(true);
      const userDocRef = firebaseFirestore.collection("users").doc(id);
      firebaseFirestore
        .collection("event-responses")
        .where("user", "==", userDocRef)
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let eventIds = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              eventIds.push(data.event.id);
            });
            firebaseFirestore
              .collection("events")
              .where("id", "in", eventIds)
              .get()
              .then(snapshot => {
                if (!snapshot.empty) {
                  let userEvents = [];
                  snapshot.forEach(doc => {
                    const data = doc.data();
                    userEvents.push(data);
                  });
                  setEvents(userEvents);
                }
                setIsLoading(false);
              })
              .catch(error => {
                console.error({ error });
                setError(error);
                setIsLoading(false);
              });
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
