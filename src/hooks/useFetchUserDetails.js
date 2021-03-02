import React from "react";
import isEmpty from "lodash.isempty";

import firebase from "src/firebase";
import { mapUser } from "src/utilities/user";
import { COLLECTIONS } from "src/constants/firebase";

const useFetchUserDetails = id => {
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

        firebase
          .firestore()
          .collection(COLLECTIONS.USERS)
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
