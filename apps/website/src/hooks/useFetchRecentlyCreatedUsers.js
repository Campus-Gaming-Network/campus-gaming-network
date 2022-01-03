// Libraries
import React from "react";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchRecentlyCreatedUsers = (_limit) => {
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
        const recentlyCreatedUsersSnapshot = await getDocs(
          query(
            collection(db, COLLECTIONS.USERS),
            orderBy("createdAt", "desc"),
            limit(_limit)
          )
        );

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
  }, [_limit]);

  return [users, state, error];
};

export default useFetchRecentlyCreatedUsers;
