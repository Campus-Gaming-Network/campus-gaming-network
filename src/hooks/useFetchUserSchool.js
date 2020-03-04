import React from "react";
import firebase from "firebase/app";

const db = firebase.firestore();

export const useFetchUserSchool = user => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [school, setSchool] = React.useState(null);
    const [error, setError] = React.useState(null);
  
    React.useEffect(() => {
      const loadSchool = async () => {
        setIsLoading(true);
        user.school
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              setSchool({
                ref: doc,
                ...data
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
  
      if (user) {
        loadSchool();
      }
    }, [user]);
  
    console.log({ isLoading, school, error });
  
    return [school, isLoading, error];
  };