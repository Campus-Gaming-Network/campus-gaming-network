// Libraries
import React from 'react';
import isEmpty from 'lodash.isempty';
import { getDoc, doc } from 'firebase/firestore';

// Other
import { db } from 'src/firebase';

// Utilities
import { mapEvent } from 'src/utilities/event';

// Constants
import { COLLECTIONS } from 'src/constants/firebase';

const useFetchEventDetails = (id) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [event, setEvent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      setEvent(null);
      setError(null);

      if (state.events[id] && !isEmpty(state.events[id])) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[CACHE] fetchEventDetails...${id}`);
        }

        setEvent(state.events[id]);
        setIsLoading(false);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[API] fetchEventDetails...${id}`);
        }

        getDoc(doc(db, COLLECTIONS.EVENTS, id))
          .then((doc) => {
            if (doc.exists) {
              setEvent(mapEvent(doc.data(), doc));
            }
            setIsLoading(false);
          })
          .catch((error) => {
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
