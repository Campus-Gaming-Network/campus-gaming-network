import React from "react";
import isEmpty from "lodash.isempty";

import { firebase, firestore } from "src/firebase";
import { mapEvent } from "src/utilities/event";
import { COLLECTIONS } from "src/constants/firebase";
import { DEFAULT_EVENTS_LIST_PAGE_SIZE } from "src/constants/other";
import { useAppState } from "src/store";

const useFetchSchoolEvents = (
  id,
  limit = DEFAULT_EVENTS_LIST_PAGE_SIZE,
  page = 0
) => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      setIsLoading(true);
      setEvents(null);
      setError(null);

      if (
        state.schools[id] &&
        !isEmpty(state.schools[id]) &&
        state.schools[id].events &&
        !isEmpty(state.schools[id].events) &&
        !!state.schools[id].events[page]
      ) {
        console.log(`[CACHE] fetchSchoolEvents...${id}`);

        setEvents(state.schools[id].events[page]);
        setIsLoading(false);
      } else {
        console.log(`[API] fetchSchoolEvents...${id}`);

        const schoolDocRef = firestore.collection(COLLECTIONS.SCHOOLS).doc(id);
        const now = new Date();

        let query = firestore
          .collection(COLLECTIONS.EVENTS)
          .where("school.ref", "==", schoolDocRef)
          .where(
            "endDateTime",
            ">=",
            firebase.firestore.Timestamp.fromDate(now)
          );

        if (page > 0) {
          if (!pages[page]) {
            query = query.startAfter(pages[page - 1].last);
          } else {
            query = query.startAt(pages[page].first);
          }
        }

        query
          .limit(limit)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              let schoolEvents = [];

              snapshot.forEach(doc => {
                const data = doc.data();
                schoolEvents.push(
                  mapEvent(
                    {
                      id: doc.id,
                      ...data
                    },
                    doc
                  )
                );
              });

              setEvents(schoolEvents);
              setIsLoading(false);
              setPages(prev => ({
                ...prev,
                ...{
                  [page]: {
                    first: schoolEvents[0].doc,
                    last: schoolEvents[schoolEvents.length - 1].doc
                  }
                }
              }));
            } else {
              setEvents([]);
              setIsLoading(false);
              setPages(prev => ({
                ...prev,
                ...{
                  [page]: {
                    first: null,
                    last: null
                  }
                }
              }));
            }
          })
          .catch(error => {
            console.error({ error });
            setError(error);
            setIsLoading(false);
          });
      }
    };

    if (id) {
      fetchSchoolEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, limit, page, pages]);

  return [events, isLoading, error];
};

export default useFetchSchoolEvents;
