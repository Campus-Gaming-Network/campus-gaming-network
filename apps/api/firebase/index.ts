import * as firebaseAdmin from "firebase-admin";

import config from "../config";

const { env, firebase } = config;

try {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebase[env].serviceAccount),
    databaseURL: firebase[env].databaseURL,
  });
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default firebaseAdmin;
