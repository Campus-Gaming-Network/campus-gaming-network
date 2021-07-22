import firebaseAdmin from "src/firebaseAdmin";
import { mapTeam } from "src/utilities/team";

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

export const getTeamUsers = async (id, limit = 25, page = 0) => {
  let users = [];

  try {
    return { users };
  } catch (error) {
    return { users, error };
  }
};
