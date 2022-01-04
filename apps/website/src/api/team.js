import firebaseAdmin from 'src/firebaseAdmin';
import { mapTeam } from 'src/utilities/team';
import { mapTeammate } from 'src/utilities/teammate';

export const getTeamDetails = async (teamId) => {
  let team = null;

  try {
    const teamDoc = await firebaseAdmin.firestore().collection('teams').doc(teamId).get();

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
    const teamsDocRef = firebaseAdmin.firestore().collection('teams').doc(teamId);
    const teammatesSnapshot = await firebaseAdmin
      .firestore()
      .collection('teammates')
      .where('team.ref', '==', teamsDocRef)
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

export const getTeamRole = async (userId, teamId) => {
  let role = null;
  let userTeamRole = null;

  try {
    const userTeamRolesSnapshot = await firebaseAdmin
      .firestore()
      .collection('user-roles')
      .where('user.id', '==', userId)
      .where('team.id', '==', teamId)
      .limit(1)
      .get();

    if (!userTeamRolesSnapshot.empty) {
      userTeamRole = userTeamRolesSnapshot.docs[0].data();
    }
  } catch (error) {
    return { role, error };
  }

  try {
    const rolesSnapshot = await firebaseAdmin
      .firestore()
      .collection('roles')
      .where('id', '==', userTeamRole.role.id)
      .limit(1)
      .get();

    if (!rolesSnapshot.empty) {
      const roleData = rolesSnapshot.docs[0].data();

      role = {
        name: roleData.name,
        permissions: roleData.permissions,
      };
    }

    return { role };
  } catch (error) {
    return { role, error };
  }
};

export const getTeamRoles = async (teamId) => {
  const roles = {};

  try {
    const userTeamRolesSnapshot = await firebaseAdmin
      .firestore()
      .collection('user-roles')
      .where('team.id', '==', teamId)
      .get();

    if (!userTeamRolesSnapshot.empty) {
      userTeamRolesSnapshot.forEach((doc) => {
        const { user, role } = doc.data();

        roles[role.id] = {
          ...role,
          user,
        };
      });
    }
  } catch (error) {
    return { roles, error };
  }

  try {
    const rolesSnapshot = await firebaseAdmin
      .firestore()
      .collection('roles')
      .where('id', 'in', Object.keys(roles))
      .get();

    if (!rolesSnapshot.empty) {
      rolesSnapshot.forEach((doc) => {
        const { id, name, permissions } = doc.data();

        Object.values(roles).forEach((role) => {
          if (role.id === id) {
            role.name = name;
            role.permissions = permissions;
          }
        });
      });
    }

    return { roles };
  } catch (error) {
    return { roles, error };
  }
};
