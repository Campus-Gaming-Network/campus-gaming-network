import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapUser } from "../utilities";
import * as constants from "../constants";
import { useAppState } from "../store";
import isEmpty from "lodash.isempty";

const useFetchSchoolUsers = (
  id,
  limit = constants.DEFAULT_USERS_LIST_PAGE_SIZE,
  page = 0
) => {
  const state = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    const fetchSchoolUsers = async () => {
      setIsLoading(true);
      setUsers(null);
      setError(null);

      if (
        state.schools[id].users &&
        !isEmpty(state.schools[id].users) &&
        !!state.schools[id].users[page]
      ) {
        console.log("[CACHE] fetchSchoolUsers...");

        setUsers(state.schools[id].users[page]);
        setIsLoading(false);
      } else {
        console.log("[API] fetchSchoolUsers...");

        const schoolDocRef = firebaseFirestore.collection("schools").doc(id);

        let query = firebaseFirestore
          .collection("users")
          .where("school", "==", schoolDocRef);

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
              let schoolUsers = [];

              snapshot.forEach(doc => {
                schoolUsers.push(mapUser(doc.data(), doc));
              });

              setUsers(schoolUsers);
              setIsLoading(false);
              setPages(prev => ({
                ...prev,
                ...{
                  [page]: {
                    first: schoolUsers[0].doc,
                    last: schoolUsers[schoolUsers.length - 1].doc
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
      fetchSchoolUsers();
    }
  }, [id, limit, page, pages, state.schools]);

  return [users, isLoading, error];
};

export default useFetchSchoolUsers;
