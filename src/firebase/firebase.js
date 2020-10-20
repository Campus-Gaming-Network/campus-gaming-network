import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import { FIREBASE_CONFIG } from "../constants";

export const _firebase = firebase;
export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);

export const firebaseAuth = firebase.auth();
export const firebaseFirestore = firebase.firestore();
export const firebaseStorage = firebase.storage();
