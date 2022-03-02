// Libraries
import React from "react";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { STATES } from "src/constants/api";
import { API } from "src/api/new";

const useFetchRecentlyCreatedEvents = (page = 0, _limit = 25) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pagination, setPagination] = React.useState({});

  React.useEffect(() => {
    const fetchRecentlyCreatedEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log("[API] fetchRecentlyCreatedEvents...");
      }

      let _events = [];

      try {
        const response = await API().Events.getAll({
          params: {
            "endDateTime.gte": new Date(),
            limit: _limit,
            order: ["endDateTime.ASC", "createdAt.DESC"],
          },
        });
        setPagination(response.data.pagination);

        if (response?.data?.pagination.total) {
          response.data.events.forEach((event) => {
            _events.push(mapEvent(event));
          });
        }

        setState(STATES.DONE);
        setEvents(_events);
      } catch (error) {
        console.error({ error });
        setError(error);
        setState(STATES.ERROR);
      }
    };

    fetchRecentlyCreatedEvents();
  }, [page, _limit]);

  return [{ events, pagination }, state, error];
};

export default useFetchRecentlyCreatedEvents;
