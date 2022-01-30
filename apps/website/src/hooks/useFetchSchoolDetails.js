// Libraries
import React from "react";
import isEmpty from "lodash.isempty";
import { getDoc, doc } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapSchool } from "src/utilities/school";

// Constants
import { COLLECTIONS } from "src/constants/firebase";

const useFetchSchoolDetails = (id) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [school, setSchool] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolDetails = async () => {
      setIsLoading(true);
      setSchool(null);
      setError(null);

      if (state.schools[id] && !isEmpty(state.schools[id])) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[CACHE] fetchSchoolDetails...${id}`);
        }

        setSchool(state.schools[id]);
        setIsLoading(false);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[API] fetchSchoolDetails...${id}`);
        }

        getDoc(doc(db, COLLECTIONS.SCHOOLS, id))
          .then((doc) => {
            if (doc.exists) {
              setSchool(mapSchool(doc.data(), doc));
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
      fetchSchoolDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return [school, isLoading, error];
};

export default useFetchSchoolDetails;
