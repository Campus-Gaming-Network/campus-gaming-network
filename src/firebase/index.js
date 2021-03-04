import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import { FIREBASE_CONFIG } from "src/constants/firebase";

if (typeof window !== "undefined" && !firebase.apps.length) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  } catch (error) {
    if (!/already exists/.test(error.message)) {
      console.error("Firebase initialization error", error.stack);
      or;
    }
  }
}

export default firebase;
