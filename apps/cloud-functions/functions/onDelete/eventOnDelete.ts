import { db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// eventOnDelete
export const eventOnDelete = functions.firestore.document(DOCUMENT_PATHS.EVENT).onDelete(async (_, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // If a user deletes an event, find all the event-responses tied to the event and
  // delete those too.
  //
  ////////////////////////////////////////////////////////////////////////////////

  const eventDocRef = db.collection(COLLECTIONS.EVENTS).doc(context.params.eventId);
  const eventResponsesQuery = db
    .collection(COLLECTIONS.EVENT_RESPONSES)
    .where('event.ref', QUERY_OPERATORS.EQUAL_TO, eventDocRef);

  try {
    const querySnapshot = await eventResponsesQuery.get();

    if (!querySnapshot.empty) {
      const batch = db.batch();

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    }
  } catch (error) {
    return;
  }

  return;
});
