import * as firebase from "firebase-admin";

export const getSchools = async (limit = 25) => {
  let schools = [];

  try {
    const schoolsSnapshot = await firebase
      .firestore()
      .collection("schools")
      .limit(limit)
      .get();

    if (!schoolsSnapshot.empty) {
      schoolsSnapshot.forEach(doc => {
        const school = doc.data();
        schools.push(school);
      });
    }

    return { schools };
  } catch (error) {
    return { schools, error };
  }
};
