import firebaseAdmin from "src/firebaseAdmin";
import { mapTeam } from "src/utilities/team";
import { mapTeammate } from "src/utilities/teammate";

export const getTeamDetails = async (id) => {
  let team = null;

  try {
    const teamDoc = await firebaseAdmin
      .firestore()
      .collection("teams")
      .doc(id)
      .get();

    if (teamDoc.exists) {
      team = { ...mapTeam(teamDoc.data(), teamDoc) };
    }

    return { team };
  } catch (error) {
    console.log(error);
    return { team, error };
  }
};

export const getTeamUsers = async (teamId, limit = 25, page = 0) => {
  let teammates = [];

  try {
    const teamsDocRef = firebaseAdmin
      .firestore()
      .collection("teams")
      .doc(teamId);
    const teammatesSnapshot = await firebaseAdmin
      .firestore()
      .collection("teammates")
      .where("team.ref", "==", teamsDocRef)
      .limit(limit)
      .get();

    if (!teammatesSnapshot.empty) {
      teammatesSnapshot.forEach((doc) => {
        const data = doc.data();
        const teammate = mapTeammate({ id: doc.id, ...data });
        teammates.push(teammate);
      });
    }

    return { teammates };
  } catch (error) {
    return { teammates, error };
  }
};
