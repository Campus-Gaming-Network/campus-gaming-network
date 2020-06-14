import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";

const useFetchEventDetails = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [event, setEvent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);

      console.log("fetchEventDetails...");

      firebaseFirestore
        .collection("events")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setEvent(mapEvent(doc.data(), doc));
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
      fetchEventDetails();
    }
  }, [id]);

  return [event, isLoading, error];
};

export default useFetchEventDetails;
