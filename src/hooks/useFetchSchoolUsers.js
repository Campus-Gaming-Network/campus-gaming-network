// Libraries
import React from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  startAt,
} from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Utilities
import { mapUser } from "src/utilities/user";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DEFAULT_USERS_LIST_PAGE_SIZE } from "src/constants/other";

const useFetchSchoolUsers = (
  id,
  page = 0,
  _limit = DEFAULT_USERS_LIST_PAGE_SIZE
) => {
  const [status, setStatus] = React.useState("idle");
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [pages, setPages] = React.useState({});

  React.useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSchoolUsers = async () => {
      setStatus("loading");

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchSchoolUsers...${id}`);
      }

      let queryArgs = [
        collection(db, COLLECTIONS.USERS),
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

      let snapshot;

      try {
        snapshot = await getDocs(query(...queryArgs));
      } catch (error) {
        console.error({ error });
        setError(error);
        setStatus("done");
      }

      if (!snapshot.empty) {
        let schoolUsers = [];

        snapshot.forEach((doc) => {
          const user = doc.data();
          schoolUsers.push(
            mapUser({
              id: user.id,
              ...user,
            })
          );
        });

        setUsers(schoolUsers);
        setPages((prev) => ({
          ...prev,
          ...{
            [page]: {
              first: snapshot.docs[0],
              last: snapshot.docs[snapshot.docs.length - 1],
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

      setStatus("done");
    };

    fetchSchoolUsers();
  }, [id, _limit, page]);

  return [users, status, error];
};

export default useFetchSchoolUsers;
