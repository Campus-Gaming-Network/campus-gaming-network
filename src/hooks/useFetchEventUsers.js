import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";

const useFetchEventUsers = (id, limit = 25, refreshToggle) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventUsers = async () => {
      console.log("fetchEventUsers...");

      const eventDocRef = firebaseFirestore.collection("events").doc(id);

      setIsLoading(true);

      firebaseFirestore
        .collection("event-responses")
        .where("event", "==", eventDocRef)
        .where("response", "==", "YES")
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let eventUsers = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              eventUsers.push(
                mapUser({
                  id: data.user.id,
                  ...data.userDetails
                })
              );
            });
            setUsers(eventUsers);
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
      fetchEventUsers();
    }
  }, [id, limit, refreshToggle]);

  return [users, isLoading, error];
};

export default useFetchEventUsers;
