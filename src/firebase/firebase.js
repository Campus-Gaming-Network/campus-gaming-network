import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import { FIREBASE_CONFIG } from "constants/firebase";

if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

export const _firebase = firebase;
export const firebaseAuth = firebase.auth();
export const firebaseFirestore = firebase.firestore();
export const firebaseStorage = firebase.storage();
