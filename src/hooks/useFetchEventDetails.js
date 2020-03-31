import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchEventDetails = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [event, setEvent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("fetchEventDetails...");
      setIsLoading(true);
      firebaseFirestore
        .collection("events")
        .doc(id)
        .get()
        .then(doc => {
          console.log({ doc });
          if (doc.exists) {
            const data = doc.data();

            setEvent({
              ref: doc,
              ...data
            });
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
      fetchEventDetails();
    }
  }, [id]);

  return [event, isLoading, error];
};

export default useFetchEventDetails;
