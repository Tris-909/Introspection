import { firestore } from "../../databases/firebase.js";
import { randomUUID } from "crypto";

export const createTag = async () => {
  const tag = firestore.doc(`tags/${crypto.randomUUID}`);

  const createdTag = await tag.set({
    id: randomUUID,
    title: data.title,
    numberOfErrors: 0,
    createdAt: new Date.now(),
  });
};
