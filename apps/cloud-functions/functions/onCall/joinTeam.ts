import { db, functions } from '../firebase';
import { COLLECTIONS, FUNCTIONS_ERROR_CODES, QUERY_OPERATORS } from '../constants';
import { comparePasswords } from '../utils';
import { InvalidRequestError, NotAuthorizedError, ValidationError, NotFoundError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// joinTeam
export const joinTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  if (!data.teamId || !data.teamId.trim()) {
    throw new ValidationError('Team id required');
  }

  if (!data.password || !data.password.trim()) {
    throw new ValidationError('Teammate password required');
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let teamAuth;
  let team;
  let user;

  try {
    const teamsAuthSnapshot = await db
      .collection(COLLECTIONS.TEAMS_AUTH)
      .where('team.ref', QUERY_OPERATORS.EQUAL_TO, teamDocRef)
      .limit(1)
      .get();

    if (!teamsAuthSnapshot.empty) {
      teamAuth = teamsAuthSnapshot.docs[0].data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!teamAuth) {
    throw new NotFoundError('Invalid team');
  }

  if (Boolean(teamAuth)) {
    const isValidPassword = await comparePasswords(data.password, teamAuth.joinHash);

    if (!isValidPassword) {
      throw new NotAuthorizedError();
    }
  }

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

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

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
    const teammatesSnapshot = await db
      .collection(COLLECTIONS.TEAMMATES)
      .where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef)
      .where('team.ref', QUERY_OPERATORS.EQUAL_TO, teamDocRef)
      .get();

    if (!teammatesSnapshot.empty) {
      throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.ALREADY_EXISTS, 'Already joined team');
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  const teammateData = {
    user: {
      id: user.id,
      ref: userDocRef,
      firstName: user.firstName,
      lastName: user.lastName,
      gravatar: user.gravatar,
      status: user.status,
      school: {
        ref: user.school.ref,
        id: user.school.id,
        name: user.school.name,
      },
    },
    team: {
      id: team.id,
      ref: teamDocRef,
      name: team.name,
      shortName: team.shortName,
    },
  };

  try {
    await db.collection(COLLECTIONS.TEAMMATES).add(teammateData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { success: true, teamId: team.id };
});
