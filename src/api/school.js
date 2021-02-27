import * as firebase from "firebase-admin";
import { mapSchool } from "src/utilities/school";
import { mapEvent } from "src/utilities/event";
import { mapUser } from "src/utilities/user";

export const getSchoolDetails = async id => {
  let school = null;

  try {
    const schoolDoc = await firebase
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
    const schoolDocRef = firebase
      .firestore()
      .collection("schools")
      .doc(id);

    let query = firebase
      .firestore()
      .collection("events")
      .where("school.ref", "==", schoolDocRef)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now));

    if (page > 0) {
      if (!pages[page]) {
        query = query.startAfter(pages[page - 1].last);
      } else {
        query = query.startAt(pages[page].first);
      }
    }

    const schoolEventsSnapshot = await query.limit(limit).get();

    if (!schoolEventsSnapshot.empty) {
      schoolEventsSnapshot.forEach(doc => {
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
    const schoolDocRef = firebase
      .firestore()
      .collection("schools")
      .doc(id);

    let query = firebase
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
      schoolUsersSnapshot.forEach(doc => {
        const user = mapUser(doc.data(), doc);
        users.push(user);
      });
    }

    return { users };
  } catch (error) {
    return { users, error };
  }
};
