import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "./config";

export const _firebase = firebase;
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseFirestore = firebase.firestore();
