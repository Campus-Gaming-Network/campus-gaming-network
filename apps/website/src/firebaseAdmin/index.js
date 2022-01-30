import * as firebaseAdmin from 'firebase-admin';

try {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      project_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`,
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default firebaseAdmin;
