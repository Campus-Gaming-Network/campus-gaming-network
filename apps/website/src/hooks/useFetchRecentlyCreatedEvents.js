// Libraries
import React from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp, limit, startAfter, startAt } from 'firebase/firestore';

// Other
import { db } from 'src/firebase';

// Utilities
import { mapEvent } from 'src/utilities/event';

// Constants
import { COLLECTIONS } from 'src/constants/firebase';
import { STATES } from 'src/constants/api';

const useFetchRecentlyCreatedEvents = (page = 0, _limit = 25) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchRecentlyCreatedEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== 'production') {
        console.log('[API] fetchRecentlyCreatedEvents...');
      }

      let _events = [];
      let queryArgs = [
        collection(db, COLLECTIONS.EVENTS),
        where('endDateTime', '>=', Timestamp.fromDate(new Date())),
        orderBy('endDateTime'),
        orderBy('createdAt', 'desc'),
      ];

      if (page > 0) {
        if (!pages[page]) {
          queryArgs.push(startAfter(pages[page - 1].last));
        } else {
          queryArgs.push(startAt(pages[page].first));
        }
      }

      queryArgs.push(limit(_limit));

      try {
        const recentlyCreatedEventsSnapshot = await getDocs(query(...queryArgs));

        if (!recentlyCreatedEventsSnapshot.empty) {
          recentlyCreatedEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = {
              ...mapEvent({ id: doc.id, _createdAt: data.createdAt.toDate(), ...data }, doc),
            };
            _events.push(event);
          });

          setPages((prev) => ({
            ...prev,
            ...{
              [page]: {
                first: recentlyCreatedEventsSnapshot.docs[0],
                last: recentlyCreatedEventsSnapshot.docs[recentlyCreatedEventsSnapshot.docs.length - 1],
              },
            },
          }));
        } else {
          setPages((prev) => ({
            ...prev,
            ...{
              [page]: {
                first: null,
                last: null,
              },
            },
          }));
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

  return [events, state, error];
};

export default useFetchRecentlyCreatedEvents;
