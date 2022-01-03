import { functions, storage } from '../firebase';

////////////////////////////////////////////////////////////////////////////////
// getAllSchools
export const getAllSchools = functions.https.onCall(async (data, context) => {
  let schools: object[] = [];

  try {
    const response = await storage.bucket().file('schools.json').download();

    if (response && response.length) {
      try {
        schools = JSON.parse(response[0].toString());
      } catch (error) {
        console.log(error);
        return { success: false };
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }

  return { success: true, schools };
});
