import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";

const useFetchUserDetails = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      console.log("fetchUserDetails...");
      setIsLoading(true);
      firebaseFirestore
        .collection("users")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setUser(mapUser(doc.data(), doc));
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
      fetchUserDetails();
    }
  }, [id]);

  return [user, isLoading, error];
};

export default useFetchUserDetails;
