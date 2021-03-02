import React from "react";
import isEmpty from "lodash.isempty";

import firebase from "src/firebase";
import { mapEvent } from "src/utilities/event";
import { COLLECTIONS } from "src/constants/firebase";

const useFetchEventDetails = id => {
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

        firebase
          .firestore()
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
