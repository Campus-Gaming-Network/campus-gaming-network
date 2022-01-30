import * as firebaseAdmin from 'firebase-admin';

try {
  const cert = {
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    project_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
  };
  console.log(JSON.stringify(cert));
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(cert),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`,
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default firebaseAdmin;
