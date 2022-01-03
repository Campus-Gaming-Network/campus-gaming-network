import { admin, db, functions } from '../firebase';
import {
  STATIC_DOCS,
  IGDB_CLIENT_ID,
  IGDB_CLIENT_SECRET,
  IGDB_GRANT_TYPE,
  COLLECTIONS,
  FUNCTIONS_ERROR_CODES,
} from '../constants';

import rp from 'request-promise';
import { DateTime } from 'luxon';
import { InvalidRequestError, ValidationError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// searchGames
export const searchGames = functions.https.onCall(async (data, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches IGDB for games matching search query.
  //
  // Returns a list of matching games, limited to 10, containing the fields: name, cover url, slug.
  //
  // The data returned for each query isn't that important and probably doesn't change often
  // so it isn't a priorty that we always return fresh data, so we store each query and
  // their results in a firestore collection "game-queries" and track how many times
  // the specific query has been made.
  //
  // If the query has been made previously, we grab the results from the stored document
  // instead of querying IGDB to save on API requests. (hopefully this is more cost effective).
  //
  // Later on we should make a change that checks the last time the document has been updated and
  // if its been longer than a certain time period (maybe 1-2 months?), we should update the query
  // results so it stays just slightly relevant.
  //
  // By counting how many times a query is made, we can eventually optimize for the top N queries and
  // their results.
  //
  // TODO: Rewrite with new IGDB api process involved
  //
  ////////////////////////////////////////////////////////////////////////////////

  if (!data || !context || !IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET || !IGDB_GRANT_TYPE) {
    throw new InvalidRequestError();
  }

  const configsQueryRef = db.collection(COLLECTIONS.CONFIGS).doc(STATIC_DOCS.IGDB);
  const gameQueryRef = db.collection(COLLECTIONS.GAME_QUERIES).doc(data.query);

  let tokenStatus = 'READY';
  let accessToken;
  let expireDateTime;
  let authResponse;
  let gameQueryDoc;
  let igdbConfigDoc;
  let igdbResponse;

  // See if we've made this same query before
  try {
    gameQueryDoc = await gameQueryRef.get();
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  // Return what we have stored if weve made the query before
  if (gameQueryDoc && gameQueryDoc.exists) {
    // But first, update the query account
    try {
      await gameQueryRef.set({ queries: admin.firestore.FieldValue.increment(1) }, { merge: true });
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }

    const gameQueryData = gameQueryDoc.data() || {};

    return {
      success: true,
      games: gameQueryData.games,
      query: data.query,
    };
  }

  // Check if we have a token already stored
  try {
    igdbConfigDoc = await configsQueryRef.get();
  } catch (error: any) {
    tokenStatus = 'ERROR';
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (igdbConfigDoc && igdbConfigDoc.exists) {
    const igdbConfigData = igdbConfigDoc.data() || {};

    accessToken = igdbConfigData.accessToken;
    expireDateTime = igdbConfigData.expireDateTime;
  } else {
    tokenStatus = 'NOT_EXISTS';
  }

  // Check if the stored token is expired
  if (tokenStatus === 'READY') {
    const today = DateTime.local();
    const expiration = DateTime.fromISO(expireDateTime.toDate().toISOString());
    const { days } = expiration.diff(today, 'days').toObject();
    const DAYS_WITHIN_EXPIRATION = 14;
    if (days && Math.floor(days) <= DAYS_WITHIN_EXPIRATION) {
      tokenStatus = 'EXPIRED';
    }
  }

  // Get a new token if its expired or does not exist
  if (tokenStatus !== 'READY') {
    try {
      authResponse = await rp({
        method: 'POST',
        uri: 'https://id.twitch.tv/oauth2/token',
        json: true,
        body: {
          client_id: IGDB_CLIENT_ID,
          client_secret: IGDB_CLIENT_SECRET,
          grant_type: IGDB_GRANT_TYPE,
        },
      });
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }

    if (authResponse) {
      accessToken = authResponse.access_token;

      try {
        const igdbData = {
          accessToken: authResponse.access_token,
          expiresIn: authResponse.expires_in,
          tokenType: authResponse.token_type,
          expireDateTime: admin.firestore.Timestamp.fromDate(
            new Date(DateTime.local().plus({ seconds: authResponse.expires_in }).toString()),
          ),
        };

        await db.collection(COLLECTIONS.CONFIGS).doc(STATIC_DOCS.IGDB).set(igdbData, { merge: true });
      } catch (error: any) {
        throw new functions.https.HttpsError(error.code, error.message);
      }
    }
  }

  if (!accessToken) {
    throw new ValidationError('Missing access token');
  }

  try {
    igdbResponse = await rp({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: `fields name, cover.url, slug; search "${data.query}"; limit 10;`,
      transform: (body) => JSON.parse(body),
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }

  if (igdbResponse) {
    if (igdbResponse.length > 0) {
      try {
        await db
          .collection(COLLECTIONS.GAME_QUERIES)
          .doc(data.query)
          .set(
            {
              games: igdbResponse || [],
              queries: admin.firestore.FieldValue.increment(1),
            },
            { merge: true },
          );
      } catch (error: any) {
        throw new functions.https.HttpsError(error.code, error.message);
      }
    }

    return {
      success: true,
      games: igdbResponse || [],
      query: data.query,
    };
  }

  throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.UNKNOWN, 'Invalid request');
});
