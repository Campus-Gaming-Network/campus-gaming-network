import { admin, db, functions, auth } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, EVENT_RESPONSES } from '../constants';
import { createEventResponseEmail } from '../utils';
import { sendEventEmail } from '../mailgun';

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnCreated
export const eventResponsesOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.EVENT_RESPONSES)
  .onCreate(async (snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many people are going to an event, when a event-response is created
    // find the event tied to it and increment the responses by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (!snapshot.exists) {
      return;
    }

    const eventResponseData = snapshot.data();
    const eventRef = db.collection(COLLECTIONS.EVENTS).doc(eventResponseData.event.id);

    if (eventResponseData.response === EVENT_RESPONSES.YES) {
      try {
        await eventRef.set({ responses: { yes: admin.firestore.FieldValue.increment(1) } }, { merge: true });
      } catch (error) {
        return;
      }

      if (!eventResponseData.user.id) {
        return;
      }

      let authRecord;

      try {
        authRecord = await auth.getUser(eventResponseData.user.id);
      } catch (error) {
        return;
      }

      if (authRecord && authRecord.email) {
        try {
          const to = authRecord.email;
          const subject = `You're attending ${eventResponseData.event.name}`;
          const text = '';
          const html = createEventResponseEmail(eventResponseData.event);
          await sendEventEmail(to, subject, text, html);
        } catch (error) {
          console.log(error);
          return;
        }
      }
    } else if (eventResponseData.response === EVENT_RESPONSES.NO) {
      try {
        await eventRef.set({ responses: { no: admin.firestore.FieldValue.increment(1) } }, { merge: true });
      } catch (error) {
        return;
      }
    }

    return;
  });
