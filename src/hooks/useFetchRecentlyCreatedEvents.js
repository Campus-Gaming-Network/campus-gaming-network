import React from "react";

import { firebase, firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";
import { DEFAULT_EVENTS_LIST_PAGE_SIZE, COLLECTIONS } from "../constants";

const useFetchRecentlyCreatedEvents = (
  limit = DEFAULT_EVENTS_LIST_PAGE_SIZE,
  page = 0
) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  //   const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchRecentlyCreatedEvents = async () => {
      setIsLoading(true);
      setEvents(null);
      setError(null);

      console.log("[API] fetchRecentlyCreatedEvents...");

      const now = new Date();

      let query = firebaseFirestore
        .collection(COLLECTIONS.EVENTS)
        .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
        .orderBy("endDateTime")
        .orderBy("createdAt", "desc");

      // if (page > 0) {
      //   if (!pages[page]) {
      //     query = query.startAfter(pages[page - 1].last);
      //   } else {
      //     query = query.startAt(pages[page].first);
      //   }
      // }

      query
        .limit(limit)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            let _events = [];

            snapshot.forEach(doc => {
              const data = doc.data();
              _events.push(
                mapEvent(
                  {
                    id: doc.id,
                    _createdAt: data.createdAt.toDate(),
                    ...data
                  },
                  doc
                )
              );
            });

            setEvents(_events);
            setIsLoading(false);
            //   setPages(prev => ({
            //     ...prev,
            //     ...{
            //       [page]: {
            //         first: _events[0].doc,
            //         last: _events[_events.length - 1].doc
            //       }
            //     }
            //   }));
          } else {
            setEvents([]);
            setIsLoading(false);
            //   setPages(prev => ({
            //     ...prev,
            //     ...{
            //       [page]: {
            //         first: null,
            //         last: null
            //       }
            //     }
            //   }));
          }
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    fetchRecentlyCreatedEvents();
  }, [limit]);

  return [events, isLoading, error];
};

export default useFetchRecentlyCreatedEvents;
