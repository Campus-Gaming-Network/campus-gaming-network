import React from "react";
import { firebase, firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";
import * as constants from "../constants";
import { useAppState } from "../store";
import isEmpty from "lodash.isempty";

const useFetchSchoolEvents = (
  id,
  limit = constants.DEFAULT_EVENTS_LIST_PAGE_SIZE,
  page = 0
) => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      setIsLoading(true);
      setEvents(null);
      setError(null);

      if (
        state.schools[id].events &&
        !isEmpty(state.schools[id].events) &&
        !!state.schools[id].events[page]
      ) {
        console.log("[CACHE] fetchSchoolEvents...");

        setEvents(state.schools[id].events);
        setIsLoading(false);
      } else {
        console.log("[API] fetchSchoolEvents...");

        const schoolDocRef = firebaseFirestore.collection("schools").doc(id);
        const now = new Date();

        let query = firebaseFirestore
          .collection("events")
          .where("school", "==", schoolDocRef)
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
  }, [id, limit, page, pages, state.schools]);

  return [events, isLoading, error];
};

export default useFetchSchoolEvents;
