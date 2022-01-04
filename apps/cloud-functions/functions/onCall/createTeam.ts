import { db, functions } from '../firebase';
import { COLLECTIONS } from '../constants';
import { hashPassword } from '../utils';
import {
  EmailVerificationEror,
  InvalidRequestError,
  NotAuthorizedError,
  ValidationError,
  NotFoundError,
} from '../errors';

////////////////////////////////////////////////////////////////////////////////
// createTeam
export const createTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    throw new EmailVerificationEror();
  }

  if (!data.name || !data.name.trim()) {
    throw new ValidationError('Team name required');
  }

  if (data.name.length > 255) {
    throw new ValidationError('Team name too long');
  }

  if (!data.password || !data.password.trim()) {
    throw new ValidationError('Team password required');
  }

  if (data.password.length > 255) {
    throw new ValidationError('Team password too long');
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

  let user;

  try {
    const userRecord = await userDocRef.get();

    if (userRecord.exists) {
      user = userRecord.data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!user) {
    throw new NotFoundError('Invalid user');
  }

  const shortName = data.shortName ? data.shortName.trim() : data.shortName;
  const description = data.description ? data.description.trim() : data.description;
  const website = data.website ? data.website.trim() : data.website;

  const teamData = {
    name: data.name.trim(),
    shortName,
    description,
    website,
    roles: {
      leader: {
        id: user.id,
        ref: userDocRef,
      },
    },
    memberCount: 0,
  };

  let teamDocRef;

  try {
    teamDocRef = await db.collection(COLLECTIONS.TEAMS).add(teamData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  try {
    await teamDocRef.set({ id: teamDocRef.id }, { merge: true });
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
      id: teamDocRef.id,
      ref: teamDocRef,
      name: teamData.name,
      shortName: teamData.shortName,
    },
  };

  try {
    await db.collection(COLLECTIONS.TEAMMATES).add(teammateData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  const joinHash = await hashPassword(data.password.trim());

  const teamsAuthData = {
    team: {
      id: teamDocRef.id,
      ref: teamDocRef,
    },
    joinHash,
  };

  try {
    await db.collection(COLLECTIONS.TEAMS_AUTH).add(teamsAuthData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { success: true, teamId: teamDocRef.id };
});
