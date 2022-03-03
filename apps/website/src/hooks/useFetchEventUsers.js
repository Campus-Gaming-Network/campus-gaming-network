// Libraries
import React from "react";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { DEFAULT_USERS_LIST_PAGE_SIZE } from "src/constants/other";
import { API } from "src/api/new";

const useFetchEventUsers = (
  id,
  page = 0,
  _limit = DEFAULT_USERS_LIST_PAGE_SIZE
) => {
  const [status, setStatus] = React.useState("idle");
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});
  const [pagination, setPagination] = React.useState({});

  React.useEffect(() => {
    const fetchEventUsers = async () => {
      setStatus("loading");

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchEventUsers...${id}`);
      }

      try {
        const response = await API().Events.getAllParticipants(id, {
          params: {
            limit: _limit,
          },
        });

        let eventUsers = [];

        if (response?.data?.pagination.total) {
          response.data.users.forEach((user) => {
            eventUsers.push(mapUser(user));
          });
        }

        setStatus("done");
        setPagination(response.data.pagination);
        setUsers(eventUsers);
      } catch (error) {
        console.error({ error });
        setError(error);
        setStatus("done");
      }
    };

    if (id) {
      fetchEventUsers();
    }
  }, [id, _limit, page]);

  return [{ users, pagination }, status, error];
};

export default useFetchEventUsers;
