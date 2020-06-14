import React from "react";
import { firebase, firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";

const useFetchSchoolEvents = (id, limit = 25) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      setIsLoading(true);

      console.log("fetchSchoolEvents...");

      const schoolDocRef = firebaseFirestore.collection("schools").doc(id);
      const now = new Date();

      firebaseFirestore
        .collection("events")
        .where("school", "==", schoolDocRef)
        .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let schoolEvents = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              schoolEvents.push(
                mapEvent(
                  {
                    id: doc.id,
                    ...data
                  },
                  doc
                )
              );
            });
            setEvents(schoolEvents);
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
      fetchSchoolEvents();
    }
  }, [id, limit]);

  return [events, isLoading, error];
};

export default useFetchSchoolEvents;
