import { db, functions } from '../firebase';
import { changeLog } from '../utils';
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateTeammatesOnTeamUpdate
export const updateTeammatesOnTeamUpdate = functions.firestore
  .document(DOCUMENT_PATHS.TEAM)
  .onUpdate(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a team updates specific fields on their document, update all other documents
    // that contain the duplicated data that we are updating.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousTeamData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousTeamData.name !== newUserData.name) {
      changes.push(changeLog(previousTeamData.name, newUserData.name));
    }

    if (previousTeamData.shortName !== newUserData.shortName) {
      changes.push(changeLog(previousTeamData.shortName, newUserData.shortName));
    }

    if (changes.length === 0) {
      return;
    }

    const teammatesQuery = db
      .collection(COLLECTIONS.TEAMMATES)
      .where('team.id', QUERY_OPERATORS.EQUAL_TO, context.params.teamId);

    console.log(`Team ${context.params.userId} updated: ${changes.join(', ')}`);

    const batch = db.batch();

    try {
      const snapshot = await teammatesQuery.get();

      if (snapshot.empty) {
        return;
      }

      const data = {
        team: {
          name: newUserData.name,
          shortName: newUserData.shortName,
        },
      };

      snapshot.forEach((doc) => {
        batch.set(doc.ref, data, { merge: true });
      });
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    return;
  });
