import { db, functions } from '../firebase';
import { COLLECTIONS, TEAM_ROLES } from '../constants';
import { InvalidRequestError, NotAuthorizedError, ValidationError, NotFoundError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// promoteTeammate
export const promoteTeammate = functions.https.onCall(async (data, context) => {
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

  if (!data.role || !data.role.trim()) {
    throw new ValidationError('Teammate role required');
  }

  if (!TEAM_ROLES.includes(data.role)) {
    throw new ValidationError('Invalid teammate role');
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;
  let user;

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
    const userDocRef = db.collection(COLLECTIONS.USERS).doc(data.teammateId);

    try {
      const record = await userDocRef.get();

      if (record.exists) {
        user = record.data();
      }
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }

    if (!user) {
      throw new NotFoundError('Invalid user');
    }

    try {
      await teamDocRef.set(
        {
          roles: {
            [data.role]: {
              id: user.id,
              ref: userDocRef,
            },
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
