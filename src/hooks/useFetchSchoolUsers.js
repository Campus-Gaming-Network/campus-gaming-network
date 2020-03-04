import React from "react";
import firebase from "firebase/app";

const db = firebase.firestore();

export const useFetchSchoolUsers = (school, limit = 25) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [users, setUsers] = React.useState(null);
    const [error, setError] = React.useState(null);
  
    console.log({ school });
  
    React.useEffect(() => {
      const loadSchoolUsers = async () => {
        setIsLoading(true);
        db.collection("users")
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
    }, [school]);
  
    console.log({ isLoading, school, error });
  
    return [school, isLoading, error];
  };