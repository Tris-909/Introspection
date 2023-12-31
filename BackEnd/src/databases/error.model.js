import { firestore } from "./firebase.js";
import crypto from "crypto";

const error = firestore.doc(`errors/${crypto.randomUUID()}`);

export const createStubError = async (data) => {
  const createdError = await error.set(data);
  return createdError;
};
