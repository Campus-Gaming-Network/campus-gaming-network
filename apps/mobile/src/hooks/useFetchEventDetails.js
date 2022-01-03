// Libraries
import React from "react";

// Utilities
import { getEvent } from "../utilities/api";

const useFetchEventDetails = (id) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [event, setEvent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      setEvent(null);
      setError(null);

      const response = await getEvent(id);

      if (response.event) {
        setEvent(response.event);
      } else if (response.error) {
        console.error(response.error);
        setError(response.error);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  return [event, isLoading, error];
};

export default useFetchEventDetails;
