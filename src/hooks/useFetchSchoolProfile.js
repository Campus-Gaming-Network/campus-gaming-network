import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchSchoolProfile = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [schoolProfile, setSchoolProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadSchoolProfile = async () => {
      setIsLoading(true);
      firebaseFirestore
        .collection("schools")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setSchoolProfile({
              ref: doc,
              ...doc.data()
            });
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
      loadSchoolProfile();
    }
  }, [id]);

  console.log({ isLoading, schoolProfile, error });

  return [schoolProfile, isLoading, error];
};

export default useFetchSchoolProfile;
