import * as firebase from "firebase-admin";
import { mapEvent } from "src/utilities/event";
import { mapUser } from "src/utilities/user";

export const getEventDetails = async id => {
  let event = null;

  try {
    const eventDoc = await firebase
      .firestore()
      .collection("events")
      .doc(id)
      .get();

    if (eventDoc.exists) {
      event = { ...mapEvent(eventDoc.data(), eventDoc) };
    }

    return { event };
  } catch (error) {
    return { event, error };
  }
};

export const getEventUsers = async (
  id,
  limit = DEFAULT_USERS_LIST_PAGE_SIZE,
  page = 0
) => {
  let users = [];

  try {
    const eventDocRef = firebase
      .firestore()
      .collection("events")
      .doc(id);

    let query = firebase
      .firestore()
      .collection("event-responses")
      .where("event.ref", "==", eventDocRef)
      .where("response", "==", "YES");

    if (page > 0) {
      if (!pages[page]) {
        query = query.startAfter(pages[page - 1].last);
      } else {
        query = query.startAt(pages[page].first);
      }
    }

    const eventUsersSnapshot = await query.limit(limit).get();

    if (!eventUsersSnapshot.empty) {
      snapshot.forEach(doc => {
        const data = doc.data();
        const user = mapUser({ id: data.user.id, ...data.user });
        users.push(user);
      });
    }

    return { users };
  } catch (error) {
    return { users, error };
  }
};
