import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchSchoolProfile = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolProfile = async () => {
      console.log("fetchSchoolProfile...");
      setIsLoading(true);
      firebaseFirestore
        .collection("schools")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setProfile({
              ref: doc,
              ...doc.data()
            });
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
      fetchSchoolProfile();
    }
  }, [id]);

  return [profile, isLoading, error];
};

export default useFetchSchoolProfile;
