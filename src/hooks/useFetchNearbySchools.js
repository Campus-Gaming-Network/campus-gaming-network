// Libraries
import React from "react";
import { geohashQueryBounds, distanceBetween } from "geofire-common";

// Other
import firebase from "src/firebase";

// Utilities
import { mapSchool } from "src/utilities/school";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { STATES } from "src/constants/api";

const useFetchNearbySchools = (latitude, longitude) => {
  const [state, setState] = React.useState(STATES.INITIAL);
  const [schools, setSchools] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchNearbySchools = async () => {
      const center = [latitude, longitude];
      const radiusInMeters = 5 * 1000;
      const bounds = geohashQueryBounds(center, radiusInMeters);
      const promises = [];

      setState(STATES.LOADING);
      setSchools(null);
      setError(null);

      if (process.env.NODE_ENV !== "production") {
        console.log(`[API] fetchNearbySchools...(${latitude}, ${longitude})`);
      }

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
          setState(STATES.DONE);
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
