import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchSchoolEvents = (id, limit = 10) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      console.log("fetchSchoolEvents...");
      setIsLoading(true);
      const schoolDocRef = firebaseFirestore.collection("schools").doc(id);
      firebaseFirestore
        .collection("events")
        .where("school", "==", schoolDocRef)
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let schoolEvents = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              schoolEvents.push({
                id: doc.id,
                ...data
              });
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
