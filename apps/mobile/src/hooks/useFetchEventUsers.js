// Libraries
import React from "react";
import { DEFAULT_USERS_LIST_PAGE_SIZE } from "@campus-gaming-network/tools";

// Utilities
import { getEventUsers } from "../utilities/api";

const useFetchEventUsers = (id, _limit = DEFAULT_USERS_LIST_PAGE_SIZE) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventUsers = async () => {
      setIsLoading(true);
      setUsers(null);
      setError(null);

      const response = await getEventUsers(id, _limit);

      if (response.users) {
        setUsers(response.users);
      } else if (response.error) {
        console.error(response.error);
        setError(response.error);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchEventUsers();
    }
  }, [id, _limit]);

  return [users, isLoading, error];
};

export default useFetchEventUsers;
