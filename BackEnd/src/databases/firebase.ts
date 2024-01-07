import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";
import { Envs } from "types";

const env = process.env.ENV as string;
const isProd = env === Envs.prod;

const adminConfig: ServiceAccount = {
  projectId: isProd
    ? process.env.PROD_FIREBASE_PROJECT_ID
    : process.env.DEV_FIREBASE_PROJECT_ID,
  clientEmail: isProd
    ? process.env.PROD_FIREBASE_CLIENT_EMAIL
    : process.env.DEV_FIREBASE_CLIENT_EMAIL,
  privateKey: isProd
    ? process.env.PROD_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    : process.env.DEV_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = admin.initializeApp(
  {
    credential: admin.credential.cert(adminConfig),
  },
  "Introspection"
);

export const firestore = getFirestore(app);
