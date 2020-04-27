import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapSchool } from "../utilities";

const useFetchSchoolDetails = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [school, setSchool] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolDetails = async () => {
      console.log("fetchSchoolDetails...");
      setIsLoading(true);
      firebaseFirestore
        .collection("schools")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setSchool(mapSchool(doc.data(), doc));
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
      fetchSchoolDetails();
    }
  }, [id]);

  return [school, isLoading, error];
};

export default useFetchSchoolDetails;
