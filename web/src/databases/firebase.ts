import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const isProd = process.env.REACT_APP_ENV === "prod";

const firebaseConfig = {
  apiKey: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_APIKEY
    : process.env.REACT_APP_DEV_FIREBASE_APIKEY,
  authDomain: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_AUTH_DOMAIN
    : process.env.REACT_APP_DEV_FIREBASE_AUTH_DOMAIN,
  projectId: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_PROJECT_ID
    : process.env.REACT_APP_DEV_FIREBASE_PROJECT_ID,
  storageBucket: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_STORAGE_BUCKET
    : process.env.REACT_APP_DEV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_MESSAGING_SENDER_ID
    : process.env.REACT_APP_DEV_FIREBASE_MESSAGING_SENDER_ID,
  appId: isProd
    ? process.env.REACT_APP_PROD_FIREBASE_APP_ID
    : process.env.REACT_APP_DEV_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
