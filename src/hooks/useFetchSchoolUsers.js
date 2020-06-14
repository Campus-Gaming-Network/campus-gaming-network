import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";

const useFetchSchoolUsers = (id, limit = 25) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolUsers = async () => {
      console.log("fetchSchoolUsers...");
      setIsLoading(true);
      const schoolDocRef = firebaseFirestore.collection("schools").doc(id);
      firebaseFirestore
        .collection("users")
        .where("school", "==", schoolDocRef)
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let schoolUsers = [];
            snapshot.forEach(doc => {
              schoolUsers.push(mapUser(doc.data(), doc));
            });
            setUsers(schoolUsers);
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
      fetchSchoolUsers();
    }
  }, [id, limit]);

  return [users, isLoading, error];
};

export default useFetchSchoolUsers;
