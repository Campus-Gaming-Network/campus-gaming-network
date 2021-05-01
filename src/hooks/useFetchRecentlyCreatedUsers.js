import React from "react";

// Other
import firebase from "src/firebase";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchRecentlyCreatedUsers = (limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchRecentlyCreatedUsers = async () => {
      setState(STATES.LOADING);
      setUsers(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log("[API] fetchRecentlyCreatedUsers...");
      }

      let _users = [];

      try {
        const recentlyCreatedUsersSnapshot = await firebase
          .firestore()
          .collection(COLLECTIONS.USERS)
          .orderBy("createdAt", "desc")
          .limit(25)
          .get();

        if (!recentlyCreatedUsersSnapshot.empty) {
          recentlyCreatedUsersSnapshot.forEach((doc) => {
            const data = doc.data();
            const user = { ...mapUser(data, doc) };
            _users.push(user);
          });
        }

        setState(STATES.DONE);
        setUsers(_users);
      } catch (error) {
        console.error({ error });
        setError(error);
        setState(STATES.ERROR);
      }
    };

    fetchRecentlyCreatedUsers();
  }, [limit]);

  return [users, state, error];
};

export default useFetchRecentlyCreatedUsers;
