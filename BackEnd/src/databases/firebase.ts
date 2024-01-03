import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";

const adminConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = admin.initializeApp(
  {
    credential: admin.credential.cert(adminConfig),
  },
  "Introspection"
);

export const firestore = getFirestore(app);
