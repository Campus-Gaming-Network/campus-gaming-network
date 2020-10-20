import React from "react";
import isEmpty from "lodash.isempty";

import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";
import * as constants from "../constants";
import { useAppState } from "../store";

const useFetchEventUsers = (
  id,
  limit = constants.DEFAULT_USERS_LIST_PAGE_SIZE,
  page = 0
) => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchEventUsers = async () => {
      setIsLoading(true);
      setUsers(null);
      setError(null);

      if (
        state.events[id] &&
        !isEmpty(state.events[id]) &&
        state.events[id].users &&
        !isEmpty(state.events[id].users) &&
        !!state.events[id].users[page]
      ) {
        console.log(`[CACHE] fetchEventUsers...${id}`);

        setUsers(state.events[id].users[page]);
        setIsLoading(false);
      } else {
        console.log(`[API] fetchEventUsers...${id}`);

        const eventDocRef = firebaseFirestore.collection("events").doc(id);

        let query = firebaseFirestore
          .collection("event-responses")
          .where("event", "==", eventDocRef)
          .where("response", "==", "YES");

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
              let eventUsers = [];

              snapshot.forEach(doc => {
                const data = doc.data();
                eventUsers.push(
                  mapUser({
                    id: data.user.id,
                    ...data.user
                  })
                );
              });

              setUsers(eventUsers);
              setIsLoading(false);
              setPages(prev => ({
                ...prev,
                ...{
                  [page]: {
                    first: eventUsers[0].doc,
                    last: eventUsers[eventUsers.length - 1].doc
                  }
                }
              }));
            } else {
              setUsers([]);
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
      fetchEventUsers();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, limit, page, pages]);

  return [users, isLoading, error];
};

export default useFetchEventUsers;
