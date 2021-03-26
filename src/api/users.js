import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { mapUser } from "src/utilities/user";

export const getRecentlyCreatedUsers = async () => {
  let users = [];

  try {
    const recentlyCreatedUsersSnapshot = await firebaseAdmin
      .firestore()
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(40)
      .get();

    if (!recentlyCreatedUsersSnapshot.empty) {
      recentlyCreatedUsersSnapshot.forEach((doc) => {
        const user = { ...mapUser(doc.data(), doc) };
        users.push(user);
      });
    }

    return { users };
  } catch (error) {
    return { users, error };
  }
};
