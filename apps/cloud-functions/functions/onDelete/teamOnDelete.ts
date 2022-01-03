import { db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// teamOnDelete
export const teamOnDelete = functions.firestore.document(DOCUMENT_PATHS.TEAM).onDelete(async (_, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // If a user deletes a team, find all the team-auths tied to the team and
  // delete those too.
  //
  // TODO: If the team has members, dont allow them to delete it? Or just display
  // a warning on the frontend?
  //
  ////////////////////////////////////////////////////////////////////////////////

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(context.params.teamId);
  const teamsAuthResponsesQuery = db
    .collection(COLLECTIONS.TEAMS_AUTH)
    .where('team.ref', QUERY_OPERATORS.EQUAL_TO, teamDocRef);
  const teammatesResponsesQuery = db
    .collection(COLLECTIONS.TEAMMATES)
    .where('team.ref', QUERY_OPERATORS.EQUAL_TO, teamDocRef);

  const teamsAuthSnapshot = await teamsAuthResponsesQuery.get();
  const teammatesSnapshot = await teammatesResponsesQuery.get();

  if (teamsAuthSnapshot && !teamsAuthSnapshot.empty) {
    const batch = db.batch();

    teamsAuthSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.commit();
  }

  if (teammatesSnapshot && !teammatesSnapshot.empty) {
    const batch = db.batch();

    teammatesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.commit();
  }

  return;
});
