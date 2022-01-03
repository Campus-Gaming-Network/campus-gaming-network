import { db, functions } from '../firebase';
import { changeLog } from '../utils';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateEventResponsesOnSchoolUpdate
export const updateEventResponsesOnSchoolUpdate = functions.firestore
  .document(DOCUMENT_PATHS.SCHOOL)
  .onUpdate(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // We store the name of the school tied to an event on the event-response so that it can
    // be used for display reasons. If the name of that school gets changed for whatever reason,
    // we need to update all the event-responses tied to that school.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousSchoolData = change.before.data();
    const newSchoolData = change.after.data();
    const changes = [];

    if (previousSchoolData.name !== newSchoolData.name) {
      changes.push(changeLog(previousSchoolData.name, newSchoolData.name));
    }

    if (changes.length === 0) {
      return;
    }

    const schoolDocRef = db.collection(COLLECTIONS.SCHOOLS).doc(context.params.schoolId);
    const eventResponsesQuery = db
      .collection(COLLECTIONS.EVENT_RESPONSES)
      .where('school.ref', QUERY_OPERATORS.EQUAL_TO, schoolDocRef);

    console.log(`School ${context.params.schoolId} updated: ${changes.join(', ')}`);

    const batch = db.batch();

    try {
      const snapshot = await eventResponsesQuery.get();

      if (snapshot.empty) {
        return;
      }

      snapshot.forEach((doc) => {
        batch.set(
          doc.ref,
          {
            school: {
              name: newSchoolData.name,
            },
          },
          { merge: true },
        );
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
