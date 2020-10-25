import React from "react";
import isEmpty from "lodash.isempty";

import { firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";
import { useAppState } from "../store";
import { COLLECTIONS } from "../constants";

const useFetchEventDetails = id => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [event, setEvent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      setEvent(null);
      setError(null);

      if (state.events[id] && !isEmpty(state.events[id])) {
        console.log(`[CACHE] fetchEventDetails...${id}`);

        setEvent(state.events[id]);
        setIsLoading(false);
      } else {
        console.log(`[API] fetchEventDetails...${id}`);

        firebaseFirestore
          .collection(COLLECTIONS.EVENTS)
          .doc(id)
          .get()
          .then(doc => {
            if (doc.exists) {
              setEvent(mapEvent(doc.data(), doc));
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error({ error });
            setError(error);
            setIsLoading(false);
          });
      }
    };

    if (id) {
      fetchEventDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return [event, isLoading, error];
};

export default useFetchEventDetails;
