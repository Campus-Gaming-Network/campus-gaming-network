// Libraries
import React from "react";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { STATES } from "src/constants/api";
import { API } from "src/api/new";

const useFetchSchoolEvents = (id) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pagination, setPagination] = React.useState({});

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchSchoolEvents...${id}`);
      }

      let _events = [];

      try {
        const response = await API().Schools.getEvents(id, {
          params: {
            "endDateTime.gte": new Date(),
            limit: 25,
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

    if (id) {
      fetchSchoolEvents();
    }
  }, [id]);

  return [{ events, pagination }, state, error];
};

export default useFetchSchoolEvents;
