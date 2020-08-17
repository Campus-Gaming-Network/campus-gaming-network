import React from "react";
import { mapSchool } from "../utilities";

const useFetchUserSchool = user => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [school, setSchool] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserSchool = async () => {
      setIsLoading(true);
      setSchool(null);
      setError(null);

      console.log("[API] fetchUserSchool...");

      user.school
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

    if (user) {
      fetchUserSchool();
    }
  }, [user]);

  return [school, isLoading, error];
};

export default useFetchUserSchool;
