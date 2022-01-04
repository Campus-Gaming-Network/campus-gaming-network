import { db, functions } from '../firebase';
import { changeLog } from '../utils';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateTeammatesOnUserUpdate
export const updateTeammatesOnUserUpdate = functions.firestore
  .document(DOCUMENT_PATHS.USER)
  .onUpdate(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a user updates specific fields on their document, update all other documents
    // that contain the duplicated data that we are updating.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousUserData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousUserData.firstName !== newUserData.firstName) {
      changes.push(changeLog(previousUserData.firstName, newUserData.firstName));
    }

    if (previousUserData.lastName !== newUserData.lastName) {
      changes.push(changeLog(previousUserData.lastName, newUserData.lastName));
    }

    if (previousUserData.gravatar !== newUserData.gravatar) {
      changes.push(changeLog(previousUserData.gravatar, newUserData.gravatar));
    }

    if (previousUserData.status !== newUserData.status) {
      changes.push(changeLog(previousUserData.status, newUserData.status));
    }

    if (previousUserData.school.id !== newUserData.school.id) {
      changes.push(changeLog(previousUserData.school.id, newUserData.school.id));
    }

    if (changes.length === 0) {
      return;
    }

    const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.params.userId);
    const teammtesQuery = db.collection(COLLECTIONS.TEAMMATES).where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef);

    console.log(`User ${context.params.userId} updated: ${changes.join(', ')}`);

    const batch = db.batch();

    try {
      const snapshot = await teammtesQuery.get();

      if (snapshot.empty) {
        return;
      }

      const data = {
        user: {
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          gravatar: newUserData.gravatar,
          status: newUserData.status,
          school: {
            id: newUserData.school.id,
            ref: newUserData.school.ref,
            name: newUserData.school.name,
          },
        },
      };

      snapshot.forEach((doc) => {
        batch.set(doc.ref, data, { merge: true });
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    return;
  });
