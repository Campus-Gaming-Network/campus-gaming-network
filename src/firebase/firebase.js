import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { firebaseConfig } from "./config";
import { isDev } from "../utilities";

export const _firebase = firebase;
export const firebaseApp = firebase.initializeApp(firebaseConfig);

if (isDev()) {
  firebaseApp.functions().useFunctionsEmulator("http://localhost:8080");
}

export const firebaseAuth = firebase.auth();
export const firebaseFirestore = firebase.firestore();
