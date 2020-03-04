import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchSchoolUsers = (school, limit = 25) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  console.log({ school });

  React.useEffect(() => {
    const loadSchoolUsers = async () => {
      setIsLoading(true);
      firebaseFirestore
        .collection("users")
        .where("school", "==", school.ref)
        .limit(limit)
        .get()
        .then(snapshot => {
          console.log(snapshot.docs);
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (school) {
      loadSchoolUsers();
    }
  }, [school, limit]);

  console.log({ isLoading, school, error });

  return [school, isLoading, error];
};

export default useFetchSchoolUsers;
