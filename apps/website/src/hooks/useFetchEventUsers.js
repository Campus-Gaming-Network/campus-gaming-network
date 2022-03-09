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
  limit = DEFAULT_USERS_LIST_PAGE_SIZE
) => {
  const [status, setStatus] = React.useState("idle");
  const [participants, setParticipants] = React.useState([]);
  const [error, setError] = React.useState(null);
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
            limit: limit,
            offset: page * limit,
          },
        });

        let eventParticipants = [];

        if (response?.data?.pagination.total) {
          response.data.participants.forEach((participant) => {
            eventParticipants.push({
              ...participant,
              user: mapUser(participant.user),
            });
          });
        }

        setStatus("done");
        setPagination(response.data.pagination);
        setParticipants(eventParticipants);
      } catch (error) {
        console.error({ error });
        setError(error);
        setStatus("done");
      }
    };

    if (id) {
      fetchEventUsers();
    }
  }, [id, limit, page]);

  return [{ participants, pagination }, status, error];
};

export default useFetchEventUsers;
