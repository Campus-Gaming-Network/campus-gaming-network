// Libraries
import React from "react";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { STATES } from "src/constants/api";
import { API } from "src/api/new";

const useFetchUserCreatedEvents = (id) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pagination, setPagination] = React.useState({});

  React.useEffect(() => {
    const fetchUserCreatedEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchUserCreatedEvents...${id}`);
      }

      let _events = [];

      try {
        const response = await API().Users.getEvents(1, {
          params: {
            "endDateTime.gte": new Date(),
            creatorId: id,
            limit: 25,
          },
        });

        if (response?.data?.pagination.total) {
          response.data.events.forEach((event) => {
            _events.push(mapEvent(event));
          });
        }

        setState(STATES.DONE);
        setPagination(response.data.pagination);
        setEvents(_events);
      } catch (error) {
        console.error({ error });
        setError(error);
        setState(STATES.ERROR);
      }
    };

    if (id) {
      fetchUserCreatedEvents();
    }
  }, [id]);

  return [{ events, pagination }, state, error];
};

export default useFetchUserCreatedEvents;
