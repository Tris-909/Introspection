import { firestore } from "../../databases/firebase.js";
import { randomUUID } from "crypto";

export const createError = async ({ title, description, tags }) => {
  const currentUUID = randomUUID();
  const error = firestore.doc(`errors/${currentUUID}`);

  const errorEntity = {
    id: currentUUID,
    title: title,
    description: description,
    tags: tags,
    createdAt: Date.now(),
  };

  await error.set(errorEntity);

  return errorEntity;
};
