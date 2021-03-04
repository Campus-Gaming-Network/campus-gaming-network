import firebaseAdmin from "src/firebaseAdmin";
import { mapUser } from "src/utilities/user";
import { mapEventResponse } from "src/utilities/eventResponse";

export const getUserDetails = async id => {
  let user = null;

  try {
    const userDoc = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(id)
      .get();

    if (userDoc.exists) {
      user = { ...mapUser(userDoc.data(), userDoc) };
    }

    return { user };
  } catch (error) {
    return { user, error };
  }
};

export const getUserEvents = async (
  id,
  limit = 25,
  next = null,
  prev = null
) => {
  let events = [];

  try {
    const now = new Date();
    const userDocRef = firebaseAdmin
      .firestore()
      .collection("users")
      .doc(id);

    let query = firebaseAdmin
      .firestore()
      .collection("event-responses")
      .where("user.ref", "==", userDocRef)
      .where("response", "==", "YES")
      .where(
        "event.endDateTime",
        ">=",
        firebaseAdmin.firestore.Timestamp.fromDate(now)
      );

    if (next) {
      query = query.startAfter(next);
    } else if (prev) {
      query = query.startAt(prev);
    }

    const eventsSnapshot = await query.limit(limit).get();

    if (!eventsSnapshot.empty) {
      snapshot.forEach(doc => {
        const event = mapEventResponse(doc.data(), doc);
        events.push(event);
      });
    }

    return { events };
  } catch (error) {
    return { events, error };
  }
};

export const getUserEventResponse = async (eventId, userId) => {
  let eventResponse = null;

  try {
    const eventDocRef = firebaseAdmin
      .firestore()
      .collection("events")
      .doc(eventId);
    const userDocRef = firebaseAdmin
      .firestore()
      .collection("users")
      .doc(userId);

    const eventResponseSnapshot = await firebaseAdmin
      .firestore()
      .collection("event-responses")
      .where("event.ref", "==", eventDocRef)
      .where("user.ref", "==", userDocRef)
      .limit(1)
      .get();

    if (!eventResponseSnapshot.empty) {
      const [doc] = snapshot.docs;

      eventResponse = {
        ...{
          id: doc.id,
          ref: doc,
          ...doc.data()
        }
      };
    }

    return { eventResponse };
  } catch (error) {
    return { eventResponse, error };
  }
};
