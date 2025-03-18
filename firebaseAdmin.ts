import firebaseAdmin from "firebase-admin";
import googleService from "./firebase-service-account.json";

export const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    googleService as firebaseAdmin.ServiceAccount
  ),
});
