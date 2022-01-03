import { db, functions } from '../firebase';
import { COLLECTIONS, QUERY_OPERATORS } from '../constants';
import { InvalidRequestError, NotAuthorizedError, NotFoundError, ValidationError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// kickTeammate
export const kickTeammate = functions.https.onCall(async (data, context) => {
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

  if (data.teammateId === context.auth.uid) {
    throw new ValidationError('You cannot kick yourself');
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
  const isTeamOfficer = Boolean(team.roles.officer) && team.roles.officer.id === context.auth.uid;

  if (isTeamLeader || isTeamOfficer) {
    const userDocRef = db.collection(COLLECTIONS.USERS).doc(data.teammateId);

    try {
      const teammatesSnapshot = await db
        .collection(COLLECTIONS.TEAMMATES)
        .where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef)
        .where('team.ref', QUERY_OPERATORS.EQUAL_TO, teamDocRef)
        .limit(1)
        .get();

      if (!teammatesSnapshot.empty) {
        teammatesSnapshot.docs[0].ref.delete();
      }
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }
  } else {
    throw new NotAuthorizedError();
  }

  return { success: true };
});
