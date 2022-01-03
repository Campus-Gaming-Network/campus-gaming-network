import { admin, db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// userOnCreated
export const userOnCreated = functions.firestore.document(DOCUMENT_PATHS.USER).onCreate(async (snapshot) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // To keep track of how many users belong to a school, when a user is created
  // find the school tied to it and increment the userCount by 1.
  //
  ////////////////////////////////////////////////////////////////////////////////

  if (!snapshot.exists) {
    return;
  }

  const userData = snapshot.data();
  const schoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(userData.school.id);

  try {
    await schoolRef.set({ userCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
  } catch (error) {
    console.log(error);
  }

  return;
});
