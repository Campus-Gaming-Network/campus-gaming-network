import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { FIREBASE_CONFIG } from "../constants/firebase";

let app;
let auth;
let db;

app = initializeApp(FIREBASE_CONFIG);
auth = getAuth();
db = getFirestore();

export { app, auth, db };
