import React from "react";

const useFetchUserSchool = user => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [school, setSchool] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserSchool = async () => {
      console.log("fetchUserSchool...");
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
