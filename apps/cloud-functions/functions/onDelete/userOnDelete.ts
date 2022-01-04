import { auth, db, admin, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// userOnDelete
export const userOnDelete = functions.firestore.document(DOCUMENT_PATHS.USER).onDelete(async (snapshot, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // A user can delete their account whenever they want.
  //
  // If they decide to do this, find all documents (events, event-responses, teammates, teams?) that are attached to this user
  // and delete those too so there is no record of the user.
  //
  // We delete both the firestore document of the user and their auth user profile.
  //
  ////////////////////////////////////////////////////////////////////////////////

  const userData = snapshot.data();
  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.params.userId);
  const schoolDocRef = db.collection(COLLECTIONS.SCHOOLS).doc(userData.school.id);
  const eventsQuery = db.collection(COLLECTIONS.EVENTS).where('creator', QUERY_OPERATORS.EQUAL_TO, userDocRef);
  const eventResponsesQuery = db
    .collection(COLLECTIONS.EVENT_RESPONSES)
    .where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef);
  const teammatesQuery = db.collection(COLLECTIONS.TEAMMATES).where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef);

  const batch = db.batch();

  // Decrement school user count

  batch.set(schoolDocRef, { userCount: admin.firestore.FieldValue.increment(-1) }, { merge: true });

  // Delete all event-response docs

  try {
    const querySnapshot = await eventResponsesQuery.get();

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }

  // Delete all event docs

  try {
    const querySnapshot = await eventsQuery.get();

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }

  // Delete all teammate docs

  try {
    const querySnapshot = await teammatesQuery.get();

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }

  // Commit the changes

  try {
    await batch.commit();
  } catch (error) {
    console.log(error);
    return;
  }

  // Delete auth user

  try {
    await auth.deleteUser(context.params.userId);
  } catch (error) {
    console.log(error);
  }

  return;
});
