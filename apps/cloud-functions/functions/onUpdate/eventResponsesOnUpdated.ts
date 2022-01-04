import { admin, db, functions } from '../firebase';
import { changeLog } from '../utils';
import { COLLECTIONS, DOCUMENT_PATHS, EVENT_RESPONSES } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnUpdated
export const eventResponsesOnUpdated = functions.firestore
  .document(DOCUMENT_PATHS.EVENT_RESPONSES)
  .onUpdate(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document response field is updated, increment or decrement
    // the related event responses count field.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventResponseData = change.before.data();
    const newEventResponseData = change.after.data();
    const changes = [];

    if (previousEventResponseData.response !== newEventResponseData.response) {
      changes.push(changeLog(previousEventResponseData.response, newEventResponseData.response));
    }

    if (changes.length === 0) {
      return;
    }

    const eventRef = db.collection(COLLECTIONS.EVENTS).doc(newEventResponseData.event.id);

    console.log(`Event Response ${context.params.eventResponseId} updated: ${changes.join(', ')}`);

    if (newEventResponseData.response === EVENT_RESPONSES.YES) {
      try {
        await eventRef.set(
          {
            responses: {
              no: admin.firestore.FieldValue.increment(-1),
              yes: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true },
        );
      } catch (error) {
        console.log(error);
      }
    } else if (newEventResponseData.response === EVENT_RESPONSES.NO) {
      try {
        await eventRef.set(
          {
            responses: {
              yes: admin.firestore.FieldValue.increment(-1),
              no: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true },
        );
      } catch (error) {
        console.log(error);
      }
    }

    return;
  });
