// Libraries
import React from "react";

// Other
import firebase from "src/firebase";

// Utilities
import { mapEvent } from "src/utilities/event";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchSchoolEvents = (id, limit) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [events, setEvents] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSchoolEvents = async () => {
      setState(STATES.LOADING);
      setEvents(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchSchoolEvents...${id}`);
      }

      const schoolDocRef = firebase
        .firestore()
        .collection(COLLECTIONS.SCHOOLS)
        .doc(id);
      const now = new Date();

      let _events = [];

      try {
        const schoolEventsSnapshot = await firebase
          .firestore()
          .collection(COLLECTIONS.EVENTS)
          .where("school.ref", "==", schoolDocRef)
          .where(
            "endDateTime",
            ">=",
            firebase.firestore.Timestamp.fromDate(now)
          )
          .limit(limit)
          .get();

        if (!schoolEventsSnapshot.empty) {
          schoolEventsSnapshot.forEach((doc) => {
            const data = doc.data();
            const event = {
              ...mapEvent(
                { id: doc.id, _createdAt: data.createdAt.toDate(), ...data },
                doc
              ),
            };
            _events.push(event);
          });
        }

        setState(STATES.DONE);
        setEvents(_events);
      } catch (error) {
        console.error({ error });
        setError(error);
        setState(STATES.ERROR);
      }
    };

    if (id) {
      fetchSchoolEvents();
    }
  }, [id, limit]);

  return [events, state, error];
};

export default useFetchSchoolEvents;
