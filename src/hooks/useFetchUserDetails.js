import React, { useState } from "react";
import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";
import { useCountState, useCountDispatch } from "../store";

const useFetchUserDetails = id => {
  const dispatch = useCountDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
            dispatch({
              type: "SET_USER",
              payload: mapUser(doc.data(), doc)
            });
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

  return [];
};

export default useFetchUserDetails;
