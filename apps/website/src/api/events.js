import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { mapEvent } from "src/utilities/event";

export const getRecentlyCreatedEvents = async () => {
  const now = new Date();
  let events = [];

  try {
    const recentlyCreatedEventsSnapshot = await firebaseAdmin
      .firestore()
      .collection("events")
      .where(
        "endDateTime",
        ">=",
        firebaseAdmin.firestore.Timestamp.fromDate(now)
      )
      .orderBy("endDateTime")
      .orderBy("createdAt", "desc")
      .limit(25)
      .get();

    if (!recentlyCreatedEventsSnapshot.empty) {
      recentlyCreatedEventsSnapshot.forEach((doc) => {
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
