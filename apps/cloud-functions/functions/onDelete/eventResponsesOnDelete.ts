import { admin, db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, EVENT_RESPONSES } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnDelete
export const eventResponsesOnDelete = functions.firestore
  .document(DOCUMENT_PATHS.EVENT_RESPONSES)
  .onDelete(async (snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document is deleted, find the attached event document if it
    // exists and decrement the responses count by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const deletedData = snapshot.data();

      if (deletedData) {
        const eventRef = db.collection(COLLECTIONS.EVENTS).doc(deletedData.event.id);

        let eventDoc;

        try {
          eventDoc = await eventRef.get();
        } catch (error) {
          return;
        }

        if (!eventDoc.exists) {
          return;
        }

        if (deletedData.response === EVENT_RESPONSES.YES) {
          try {
            await eventRef.set({ responses: { yes: admin.firestore.FieldValue.increment(-1) } }, { merge: true });
          } catch (error) {
            return;
          }
        } else if (deletedData.response === EVENT_RESPONSES.NO) {
          try {
            await eventRef.set({ responses: { no: admin.firestore.FieldValue.increment(-1) } }, { merge: true });
          } catch (error) {
            return;
          }
        }
      }
    }

    return;
  });
