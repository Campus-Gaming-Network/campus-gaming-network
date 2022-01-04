import { admin, db, functions } from '../firebase';
import { COLLECTIONS } from '../constants';
import { InvalidRequestError, NotAuthorizedError, NotFoundError, ValidationError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// demoteTeammate
export const demoteTeammate = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  if (!data.teamId || !data.teamId.trim()) {
    throw new ValidationError('Team id required');
  }

  if (!data.teammateId || !data.teammateId.trim()) {
    throw new ValidationError('Teammate id required');
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;

  try {
    const record = await teamDocRef.get();

    if (record.exists) {
      team = record.data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!team) {
    throw new NotFoundError('Invalid team');
  }

  const isTeamLeader = team.roles.leader.id === context.auth.uid;

  if (isTeamLeader) {
    try {
      await teamDocRef.set(
        {
          roles: {
            officer: admin.firestore.FieldValue.delete(),
          },
        },
        { merge: true },
      );
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }
  } else {
    throw new NotAuthorizedError();
  }

  return { success: true };
});
