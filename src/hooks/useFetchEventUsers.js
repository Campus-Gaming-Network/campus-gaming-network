// Libraries
import React from "react";
import isEmpty from "lodash.isempty";
import { doc, collection, query, where, getDocs } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DEFAULT_USERS_LIST_PAGE_SIZE } from "src/constants/other";

const useFetchEventUsers = (
  id,
  _limit = DEFAULT_USERS_LIST_PAGE_SIZE,
  page = 0
) => {
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
        Boolean(state.events[id].users[page])
      ) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[CACHE] fetchEventUsers...${id}`);
        }

        setUsers(state.events[id].users[page]);
        setIsLoading(false);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[API] fetchEventUsers...${id}`);
        }

        let queryArgs = [
          collection(COLLECTIONS.EVENT_RESPONSES),
          where("event.ref", "==", doc(db, COLLECTIONS.EVENTS, id)),
          where("response", "==", "YES"),
        ];

        if (page > 0) {
          if (!pages[page]) {
            queryArgs.push(startAfter(pages[page - 1].last));
          } else {
            queryArgs.push(startAt(pages[page].first));
          }
        }

        queryArgs.push(limit(_limit));

        getDocs(query(...queryArgs))
          .then((snapshot) => {
            if (!snapshot.empty) {
              let eventUsers = [];

              snapshot.forEach((doc) => {
                const data = doc.data();
                eventUsers.push(
                  mapUser({
                    id: data.user.id,
                    ...data.user,
                  })
                );
              });

              setUsers(eventUsers);
              setIsLoading(false);
              setPages((prev) => ({
                ...prev,
                ...{
                  [page]: {
                    first: eventUsers[0].doc,
                    last: eventUsers[eventUsers.length - 1].doc,
                  },
                },
              }));
            } else {
              setUsers([]);
              setIsLoading(false);
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
          })
          .catch((error) => {
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
