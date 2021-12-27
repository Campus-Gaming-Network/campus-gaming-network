import firebaseAdmin from "src/firebaseAdmin";
import { mapSchool } from "src/utilities/school";
import { mapEvent } from "src/utilities/event";
import { mapUser } from "src/utilities/user";

// const geofire = require('geofire-common');

export const getSchoolDetails = async (id) => {
  let school = null;

  try {
    const schoolDoc = await firebaseAdmin
      .firestore()
      .collection("schools")
      .doc(id)
      .get();

    if (schoolDoc.exists) {
      school = { ...mapSchool(schoolDoc.data(), schoolDoc) };
    }

    return { school };
  } catch (error) {
    return { school, error };
  }
};

export const getSchoolEvents = async (id, limit = 25, page = 0) => {
  const now = new Date();
  let events = [];

  try {
    const schoolDocRef = firebaseAdmin
      .firestore()
      .collection("schools")
      .doc(id);

    let query = firebaseAdmin
      .firestore()
      .collection("events")
      .where("school.ref", "==", schoolDocRef)
      .where(
        "endDateTime",
        ">=",
        firebaseAdmin.firestore.Timestamp.fromDate(now)
      );

    if (page > 0) {
      if (!pages[page]) {
        query = query.startAfter(pages[page - 1].last);
      } else {
        query = query.startAt(pages[page].first);
      }
    }

    const schoolEventsSnapshot = await query.limit(limit).get();

    if (!schoolEventsSnapshot.empty) {
      schoolEventsSnapshot.forEach((doc) => {
        const data = doc.data();
        const event = mapEvent({ id: doc.id, ...data }, doc);
        events.push(event);
      });
    }

    return { events };
  } catch (error) {
    return { events, error };
  }
};

export const getSchoolUsers = async (id, limit = 25, page = 0) => {
  let users = [];

  try {
    const schoolDocRef = firebaseAdmin
      .firestore()
      .collection("schools")
      .doc(id);

    let query = firebaseAdmin
      .firestore()
      .collection("users")
      .where("school.ref", "==", schoolDocRef);

    if (page > 0) {
      if (!pages[page]) {
        query = query.startAfter(pages[page - 1].last);
      } else {
        query = query.startAt(pages[page].first);
      }
    }

    const schoolUsersSnapshot = await query.limit(limit).get();

    if (!schoolUsersSnapshot.empty) {
      schoolUsersSnapshot.forEach((doc) => {
        const user = mapUser(doc.data(), doc);
        users.push(user);
      });
    }

    return { users };
  } catch (error) {
    return { users, error };
  }
};

// export const getNearbySchools = async (latitude, longitude, radiusInM = 50 * 1000) => {
//   const center = [latitude, longitude];
//   // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
//   // a separate query for each pair. There can be up to 9 pairs of bounds
//   // depending on overlap, but in most cases there are 4.
//   const bounds = geofire.geohashQueryBounds(center, radiusInM);
//   const promises = [];
//   for (const b of bounds) {
//     const q = db.collection('schools')
//       .orderBy('geohash')
//       .startAt(b[0])
//       .endAt(b[1]);

//     promises.push(q.get());
//   }

//   // Collect all the query results together into a single list
//   Promise.all(promises).then((snapshots) => {
//     const matchingDocs = [];

//     for (const snap of snapshots) {
//       for (const doc of snap.docs) {
//         const location = doc.get('location');
//         const lat = doc.get('lat');
//         const lng = doc.get('lng');

//         // We have to filter out a few false positives due to GeoHash
//         // accuracy, but most will match
//         const distanceInKm = geofire.distanceBetween([lat, lng], center);
//         const distanceInM = distanceInKm * 1000;
//         if (distanceInM <= radiusInM) {
//           matchingDocs.push(doc);
//         }
//       }
//     }

//     return matchingDocs;
//   }).then((matchingDocs) => {
//     console.log(matchingDocs);
//   });
// };
