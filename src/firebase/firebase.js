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
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }
}

export default firebase;
// export const firestore = firebase.firestore();
// export const auth = firebase.auth();
// export const storage = firebase.storage();
// export const functions = firebase.functions();
