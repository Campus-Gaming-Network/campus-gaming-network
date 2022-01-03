import * as _functions from 'firebase-functions';
import * as _admin from 'firebase-admin';

export const admin = _admin;
export const db = _admin.firestore();
export const auth = _admin.auth();
export const storage = _admin.storage();
export const functions = _functions;
