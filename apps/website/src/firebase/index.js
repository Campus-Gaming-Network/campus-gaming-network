import { initializeApp } from "firebase/app";
import { initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

import { FIREBASE_CONFIG } from "src/constants/firebase";

let app;
let db;
let auth;
let functions;

if (typeof window !== "undefined" && !app?.apps.length) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
    db = getFirestore(app);
    functions = getFunctions(app);
  } catch (error) {
    if (!/already exists/.test(error.message)) {
      console.error("Firebase initialization error", error.stack);
    }
  }
}

export { db, auth, functions };
