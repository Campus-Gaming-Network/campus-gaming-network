import React from "react";

import firebase from "src/firebase";
import { mapSchool } from "src/utilities/school";
import { COLLECTIONS } from "src/constants/firebase";

const BASE_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  DONE: "done",
};

const STATES = {
  ...BASE_STATES,
  INITIAL: BASE_STATES.IDLE,
};

const useFetchNearbySchools = (latitude, longitude) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [schools, setSchools] = React.useState(null);
  const [error, setError] = React.useState(null);
  const center = [latitude, longitude];
  const radiusInMeters = 5 * 1000;
  const bounds = geohashQueryBounds(center, radiusInMeters);
  const promises = [];

  React.useEffect(() => {
    const fetchNearbySchools = async () => {
      setState(STATES.LOADING);
      setSchools(null);
      setError(null);

      console.log("[API] fetchNearbySchools...");

      for (const b of bounds) {
        const query = firebase
          .firestore()
          .collection(COLLECTIONS.SCHOOLS)
          .where("geohash", "!=", "")
          .orderBy("geohash")
          .startAt(b[0])
          .endAt(b[1])
          .limit(25);

        promises.push(query.get());
      }

      Promise.all(promises)
        .then((snapshots) => {
          const matchingDocs = [];

          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const { longitude: _longitude, latitude: _latitude } = doc.get(
                "location"
              );

              if (Boolean(_latitude) && Boolean(_longitude)) {
                const distanceInKilometers = distanceBetween(
                  [_latitude, _longitude],
                  center
                );
                const distanceInMeters = distanceInKilometers * 1000;

                if (distanceInMeters <= radiusInMeters) {
                  matchingDocs.push(mapSchool(doc.data(), doc));
                }
              }
            }
          }

          return matchingDocs;
        })
        .then((matchingDocs) => {
          setIsLoading(STATES.DONE);
          setSchools(matchingDocs);
        })
        .catch((error) => {
          console.error({ error });
          setError(error);
          setState(STATES.ERROR);
        });
    };

    if (Boolean(latitude) && Boolean(longitude)) {
      fetchNearbySchools();
    }
  }, [latitude, longitude]);

  return [schools, state, error];
};

export default useFetchNearbySchools;
