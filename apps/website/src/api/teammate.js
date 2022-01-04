import firebaseAdmin from 'src/firebaseAdmin';
import { mapTeammate } from 'src/utilities/teammate';

export const getTeammateDetails = async (teamId, userId) => {
  let teammate = null;

  try {
    const usersDocRef = firebaseAdmin.firestore().collection('users').doc(userId);
    const teamsDocRef = firebaseAdmin.firestore().collection('teams').doc(teamId);
    const teammatesSnapshot = await firebaseAdmin
      .firestore()
      .collection('teammates')
      .where('user.ref', '==', usersDocRef)
      .where('team.ref', '==', teamsDocRef)
      .limit(1)
      .get();

    if (!teammatesSnapshot.empty) {
      const [doc] = teammatesSnapshot.docs;

      teammate = {
        ...{
          id: doc.id,
          ref: doc,
          ...doc.data(),
        },
      };
    }

    return { teammate };
  } catch (error) {
    return { teammate, error };
  }
};
