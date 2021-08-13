// Libraries
import React from "react";
import isEmpty from "lodash.isempty";
import { getDoc, doc } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { COLLECTIONS } from "src/constants/firebase";

const useFetchUserDetails = (id) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      setUser(null);
      setError(null);

      if (state.users[id] && !isEmpty(state.users[id])) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[CACHE] fetchUserDetails...${id}`);
        }

        setUser(state.users[id]);
        setIsLoading(false);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[API] fetchUserDetails...${id}`);
        }

        getDoc(doc(db, COLLECTIONS.USERS, id))
          .then((doc) => {
            if (doc.exists) {
              setUser(mapUser(doc.data(), doc));
            }
            setIsLoading(false);
          })
          .catch((error) => {
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
