// Libraries
import React from "react";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { DEFAULT_USERS_LIST_PAGE_SIZE } from "src/constants/other";
import { API } from "src/api/new";

const useFetchSchoolUsers = (
  id,
  page = 0,
  limit = DEFAULT_USERS_LIST_PAGE_SIZE
) => {
  const [status, setStatus] = React.useState("idle");
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSchoolUsers = async () => {
      setStatus("loading");

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchSchoolUsers...${id}`);
      }

      let response;

      try {
        response = await API().Schools.getUsers(id, {
          params: {
            limit: limit,
            offset: page * limit,
          },
        });
      } catch (error) {
        console.error({ error });
        setError(error);
        setStatus("done");
      }

      if (!!response?.data?.count) {
        let schoolUsers = [];

        response.data.users.forEach((user) => {
          schoolUsers.push(
            mapUser({
              id: user.id,
              ...user,
            })
          );
        });

        setUsers(schoolUsers);
        setCount(response.data.count);
      }

      setStatus("done");
    };

    fetchSchoolUsers();
  }, [id, limit, page]);

  return [{ users, count }, status, error];
};

export default useFetchSchoolUsers;
