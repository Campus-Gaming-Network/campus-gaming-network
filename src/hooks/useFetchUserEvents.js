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
            let userEventResponses = [];
            let userEventResponsesIds = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              console.log({ data });
              userEventResponses.push(doc);
              userEventResponsesIds.push(doc.id);
            });
            console.log({ userEventResponses });
            console.log({ userEventResponsesIds });
            // firebaseFirestore.getAll(...userEventResponses).then(docs => {
            //   console.log({ docs })
            // });
            firebaseFirestore
              .collection("events")
              .where(
                firebaseFirestore.FieldPath.documentId(),
                "in",
                userEventResponsesIds
              )
              .get()
              .then(snapshot => {
                console.log({ snapshot });
              })
              .catch(error => {
                console.error({ error });
              });
            // setEvents(userEvents);
          }
          setIsLoading(false);
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
