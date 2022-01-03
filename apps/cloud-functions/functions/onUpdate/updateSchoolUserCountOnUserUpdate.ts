import { admin, db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateSchoolUserCountOnUserUpdate
export const updateSchoolUserCountOnUserUpdate = functions.firestore
  .document(DOCUMENT_PATHS.USER)
  .onUpdate(async (change) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a user updates their school, decrement the previous schools userCount
    // and increment the new users school userCount.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousUserData = change.before.data();
    const newUserData = change.after.data();

    if (previousUserData.school.id === newUserData.school.id) {
      return;
    }

    const prevSchoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(previousUserData.school.id);
    const newSchoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(previousUserData.school.id);

    const batch = db.batch();

    batch.set(prevSchoolRef, { userCount: admin.firestore.FieldValue.increment(-1) }, { merge: true });

    batch.set(newSchoolRef, { userCount: admin.firestore.FieldValue.increment(1) }, { merge: true });

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    return;
  });
