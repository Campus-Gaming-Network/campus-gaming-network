import React from "react";
import isEmpty from "lodash.isempty";

import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";
import { useAppState } from "../store";

const useFetchUserDetails = id => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      setUser(null);
      setError(null);

      if (state.users[id] && !isEmpty(state.users[id])) {
        console.log(`[CACHE] fetchUserDetails...${id}`);

        setUser(state.users[id]);
        setIsLoading(false);
      } else {
        console.log(`[API] fetchUserDetails...${id}`);

        firebaseFirestore
          .collection("users")
          .doc(id)
          .get()
          .then(doc => {
            if (doc.exists) {
              setUser(mapUser(doc.data(), doc));
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error({ error });
            setError(error);
            setIsLoading(false);
          });
      }
    };

    if (id) {
      fetchUserDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return [user, isLoading, error];
};

export default useFetchUserDetails;
