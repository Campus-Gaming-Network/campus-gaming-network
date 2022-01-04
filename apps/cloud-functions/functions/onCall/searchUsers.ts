import { auth, db, functions } from '../firebase';
import { isValidEmail } from '../utils';
import { COLLECTIONS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// searchUsers
export const searchUsers = functions.https.onCall(async (data, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Allows admins to query for a user based on uid or email.
  //
  // If a matching auth user exists, it will query for the matching firestore document
  // of the user too.
  //
  ////////////////////////////////////////////////////////////////////////////////

  // TODO: Only allow admins access to this route
  try {
    const query = data.query ? data.query.trim() : '';

    let authRecord;
    let record;

    if (query && query !== '') {
      const isEmailQuery = isValidEmail(query);

      if (isEmailQuery) {
        authRecord = await auth.getUserByEmail(query);
      } else {
        authRecord = await auth.getUser(query);
      }

      if (authRecord && authRecord.uid) {
        record = await db.collection(COLLECTIONS.USERS).doc(authRecord.uid).get();
      }
    }

    return {
      authUser: authRecord,
      docUser: record && record.exists ? record.data() : null,
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }
});
