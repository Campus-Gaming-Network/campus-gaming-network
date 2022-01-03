import { db, functions } from '../firebase';
import rp from 'request-promise';
import { COLLECTIONS, CHALLONGE_API_KEY, FUNCTIONS_ERROR_CODES } from '../constants';
import { EmailVerificationEror, InvalidRequestError, NotAuthorizedError, ValidationError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// createTournament
export const createTournament = functions.https.onCall(async (data, context) => {
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
    throw new ValidationError('Tournament name required');
  }

  let challongeResponse;

  try {
    challongeResponse = await rp({
      method: 'POST',
      uri: 'https://api.challonge.com/v1/tournaments.json',
      json: true,
      body: {
        api_key: CHALLONGE_API_KEY,
        'tournament[name]': data.name,
        'tournament[tournament_type]': data.tournamentFormat,
        'tournament[url]': '',
        'tournament[subdomain]': '',
        'tournament[description]': data.description,
        'tournament[open_signup]': '',
        'tournament[hold_third_place_match]': data.holdThirdPlaceMatch,
        'tournament[pts_for_match_win]': data.ptsForMatchWin,
        'tournament[pts_for_match_tie]': data.ptsForMatchTie,
        'tournament[pts_for_game_win]': data.ptsForGameWin,
        'tournament[pts_for_game_tie]': data.ptsForGameTie,
        'tournament[pts_for_bye]': data.ptsForBye,
        'tournament[swiss_rounds]': '',
        'tournament[ranked_by]': data.rankedBy,
        'tournament[rr_pts_for_match_win]': data.rrPtsForMatchWin,
        'tournament[rr_pts_for_match_tie]': data.rrPtsForMatchTie,
        'tournament[rr_pts_for_game_win]': data.rrPtsForGameWin,
        'tournament[rr_pts_for_game_tie]': data.rrPtsForGameTie,
        'tournament[accept_attachments]': '',
        'tournament[hide_forum]': '',
        'tournament[show_rounds]': '',
        'tournament[private]': '',
        'tournament[notify_users_when_matches_open]': '',
        'tournament[notify_users_when_the_tournament_ends]': '',
        'tournament[sequential_pairings]': '',
        'tournament[signup_cap]': '',
        'tournament[start_at]': '',
        'tournament[check_in_duration]': '',
        'tournament[grand_finals_modifier]': '',
      },
    });
  } catch (error) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.UNKNOWN, 'Challonge error');
  }

  if (challongeResponse.errors) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.UNKNOWN, challongeResponse.errors.join('; '));
  }

  let tournamentDocRef;

  try {
    tournamentDocRef = await db.collection(COLLECTIONS.TOURNAMENTS).add({
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
    await tournamentDocRef.set({ id: tournamentDocRef.id }, { merge: true });
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { tournamentId: null };
});
