import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchEventUsers = (id, limit = 10) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventUsers = async () => {
      console.log("fetchEventUsers...");
      setIsLoading(true);
      const eventDocRef = firebaseFirestore.collection("events").doc(id);
      firebaseFirestore
        .collection("event-responses")
        .where("event", "==", eventDocRef)
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let userIds = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              userIds.push(data.user.id);
            });
            firebaseFirestore
              .collection("users")
              .where("id", "in", userIds)
              .get()
              .then(snapshot => {
                if (!snapshot.empty) {
                  let eventUsers = [];
                  snapshot.forEach(doc => {
                    const data = doc.data();
                    eventUsers.push(data);
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
  }, [id, limit]);

  return [users, isLoading, error];
};

export default useFetchEventUsers;
