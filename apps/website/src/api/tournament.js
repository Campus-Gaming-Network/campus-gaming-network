import firebaseAdmin from 'src/firebaseAdmin';

// Utilities
import { mapUser } from 'src/utilities/user';
import { mapTournament } from 'src/utilities/tournament';

// Constants
import { DEFAULT_USERS_LIST_PAGE_SIZE } from 'src/constants/other';

export const getTournamentDetails = async (id) => {
  let tournament = null;

  try {
    const tournamentDoc = await firebaseAdmin.firestore().collection('tournaments').doc(id).get();

    if (tournamentDoc.exists) {
      const data = tournamentDoc.data();
      tournament = mapTournament({ id: tournamentDoc.id, ...data }, tournamentDoc);
    }

    return { tournament };
  } catch (error) {
    return { tournament, error };
  }
};

export const getTournamentUsers = async (id, limit = DEFAULT_USERS_LIST_PAGE_SIZE, page = 0) => {
  let users = [];

  try {
    const tournamentDocRef = firebaseAdmin.firestore().collection('tournaments').doc(id);

    let query = firebaseAdmin
      .firestore()
      .collection('tournament-responses')
      .where('tournament.ref', '==', tournamentDocRef)
      .where('response', '==', 'YES');

    if (page > 0) {
      if (!pages[page]) {
        query = query.startAfter(pages[page - 1].last);
      } else {
        query = query.startAt(pages[page].first);
      }
    }

    const tournamentUsersSnapshot = await query.limit(limit).get();

    if (!tournamentUsersSnapshot.empty) {
      tournamentUsersSnapshot.forEach((doc) => {
        const data = doc.data();
        const user = mapUser({ id: data.user.id, ...data.user });
        users.push(user);
      });
    }

    return { users };
  } catch (error) {
    return { users, error };
  }
};
