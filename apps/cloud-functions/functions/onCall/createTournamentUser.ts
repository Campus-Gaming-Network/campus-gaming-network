import { db, functions } from '../firebase';
import rp from 'request-promise';

import { COLLECTIONS, CHALLONGE_API_KEY, FUNCTIONS_ERROR_CODES, QUERY_OPERATORS } from '../constants';
import {
  EmailVerificationEror,
  InvalidRequestError,
  NotAuthorizedError,
  ValidationError,
  NotFoundError,
} from '../errors';

const PARTICIPANT_TYPES = ['user', 'team'];

////////////////////////////////////////////////////////////////////////////////
// createTournamentParticipant
export const createTournamentParticipant = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    throw new EmailVerificationEror();
  }

  if (!data.tournamentId || !data.tournamentId.trim()) {
    throw new ValidationError('Tournament id required');
  }

  if (!data.participantType || !data.participantType.trim()) {
    throw new ValidationError('Participant type is required');
  }

  if (!PARTICIPANT_TYPES.includes(data.participantType)) {
    throw new ValidationError('Invalid participant type');
  }

  let user;

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);
  const tournamentDocRef = db.collection(COLLECTIONS.TOURNAMENTS).doc(data.tournamentId);

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
    const tournamentUsersSnapshot = await db
      .collection(COLLECTIONS.TOURNAMENT_USER)
      .where('user.ref', QUERY_OPERATORS.EQUAL_TO, userDocRef)
      .where('tournament.ref', QUERY_OPERATORS.EQUAL_TO, tournamentDocRef)
      .get();

    if (!tournamentUsersSnapshot.empty) {
      throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.ALREADY_EXISTS, 'Already joined tournament');
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  let challongeResponse;

  // const participantName =
  //   data.participantType === "team"
  //     ? team.name
  //     : Boolean(data.username) && Boolean(data.username.trim())
  //     ? data.username
  //     : `${user.firstName} ${user.lastName}`;
  const participantName = 'Test';
  const participantEmail = data.participantType === 'user' ? context.auth.token.email : null;

  try {
    challongeResponse = await rp({
      method: 'POST',
      uri: `https://api.challonge.com/v1/tournaments/${data.tournamentId}/participants.json`,
      json: true,
      body: {
        api_key: CHALLONGE_API_KEY,
        // Allow them to enter a username if entering as user not team
        'participant[name]': participantName,
        'participant[challonge_username]': '',
        'participant[email]': participantEmail,
        'participant[seed]': '',
        'participant[misc]': '',
      },
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }

  if (challongeResponse.errors) {
    return {
      success: false,
      error: challongeResponse.errors,
    };
  }

  let tournamentUserDocRef;

  try {
    tournamentUserDocRef = await db.collection(COLLECTIONS.TOURNAMENT_USER).add({
      challonge: {
        id: challongeResponse.tournament.id,
        url: challongeResponse.tournament.url,
        fullUrl: challongeResponse.tournament.full_challonge_url,
      },
      name: data.name,
      description: data.description,
    });
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  try {
    await tournamentUserDocRef.set({ id: tournamentUserDocRef.id }, { merge: true });
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { tournamentId: null };
});
