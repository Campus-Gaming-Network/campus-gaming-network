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

const useFetchSchoolUsers = (
  id,
  _limit = DEFAULT_USERS_LIST_PAGE_SIZE,
  page = 0
) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchSchoolUsers = async () => {
      setIsLoading(true);
      setUsers(null);
      setError(null);

      if (
        state.schools[id] &&
        !isEmpty(state.schools[id]) &&
        state.schools[id].users &&
        !isEmpty(state.schools[id].users) &&
        Boolean(state.schools[id].users[page])
      ) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[CACHE] fetchSchoolUsers...${id}`);
        }

        setUsers(state.schools[id].users[page]);
        setIsLoading(false);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[API] fetchSchoolUsers...${id}`);
        }

        let queryArgs = [
          collection(COLLECTIONS.USERS),
          where("school.ref", "==", doc(db, COLLECTIONS.SCHOOLS, id)),
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
              let schoolUsers = [];

              snapshot.forEach((doc) => {
                schoolUsers.push(mapUser(doc.data(), doc));
              });

              setUsers(schoolUsers);
              setIsLoading(false);
              setPages((prev) => ({
                ...prev,
                ...{
                  [page]: {
                    first: schoolUsers[0].doc,
                    last: schoolUsers[schoolUsers.length - 1].doc,
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
      fetchSchoolUsers();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, _limit, page, pages]);

  return [users, isLoading, error];
};

export default useFetchSchoolUsers;
