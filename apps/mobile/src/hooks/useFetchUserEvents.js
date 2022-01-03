// Libraries
import React from "react";
import { DEFAULT_PAGE_SIZE } from "@campus-gaming-network/tools";

// Utilities
import { getUserEvents } from "../utilities/api";

const useFetchUserEvents = (id, _limit = DEFAULT_PAGE_SIZE) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      setEvents(null);
      setError(null);

      const response = await getUserEvents(id, _limit);

      if (response.events) {
        setEvents(response.events);
      } else if (response.error) {
        console.error(response.error);
        setError(response.error);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchUserEvents();
    }
  }, [_limit]);

  return [events, isLoading, error];
};

export default useFetchUserEvents;
