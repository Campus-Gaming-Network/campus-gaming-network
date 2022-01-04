import { db, functions } from '../firebase';
import { shallowEqual, changeLog } from '../utils';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateEventResponsesOnEventUpdate
export const updateEventResponsesOnEventUpdate = functions.firestore
  .document(DOCUMENT_PATHS.EVENT)
  .onUpdate(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Updates all event responses that are tied to the event we are updating.
    //
    // There are specific fields that are duplicated on the event responses, so we
    // only need to update the event responses if those specific fields change.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventData = change.before.data();
    const newEventData = change.after.data();
    const changes = [];

    if (previousEventData.name !== newEventData.name) {
      changes.push(changeLog(previousEventData.name, newEventData.name));
    }

    if (previousEventData.description !== newEventData.description) {
      changes.push(changeLog(previousEventData.description, newEventData.description));
    }

    if (previousEventData.startDateTime !== newEventData.startDateTime) {
      changes.push(changeLog(previousEventData.startDateTime, newEventData.startDateTime));
    }

    if (previousEventData.endDateTime !== newEventData.endDateTime) {
      changes.push(changeLog(previousEventData.endDateTime, newEventData.endDateTime));
    }

    if (previousEventData.isOnlineEvent !== newEventData.isOnlineEvent) {
      changes.push(changeLog(previousEventData.isOnlineEvent, newEventData.isOnlineEvent));
    }

    if (!shallowEqual(previousEventData.responses, newEventData.responses)) {
      changes.push(changeLog(previousEventData.responses, newEventData.responses));
    }

    if (!shallowEqual(previousEventData.game, newEventData.game)) {
      changes.push(changeLog(previousEventData.game, newEventData.game));
    }

    if (changes.length === 0) {
      return;
    }

    const eventDocRef = db.collection(COLLECTIONS.EVENTS).doc(context.params.eventId);
    const eventResponsesQuery = db
      .collection(COLLECTIONS.EVENT_RESPONSES)
      .where('event.ref', QUERY_OPERATORS.EQUAL_TO, eventDocRef);

    // TODO: Objects arent being printed correctly
    console.log(`Event ${context.params.eventId} updated: ${changes.join(', ')}`);

    const batch = db.batch();

    try {
      const snapshot = await eventResponsesQuery.get();

      if (snapshot.empty) {
        return;
      }

      const data = {
        event: {
          name: newEventData.name,
          description: newEventData.description,
          startDateTime: newEventData.startDateTime,
          endDateTime: newEventData.endDateTime,
          isOnlineEvent: newEventData.isOnlineEvent,
          responses: newEventData.responses,
          game: newEventData.game,
        },
      };

      snapshot.forEach((doc) => {
        batch.set(doc.ref, data, { merge: true });
      });
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    return;
  });
