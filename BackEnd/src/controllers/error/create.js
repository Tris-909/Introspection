import { randomUUID } from "crypto";
import { createDoc } from "../../utils";
import { collectionNames } from "../../databases/firebase";

export const createError = async ({ title, description, tags }) => {
  const errorEntity = {
    id: randomUUID(),
    title: title,
    description: description,
    tags: tags,
    createdAt: Date.now(),
  };

  await createDoc({
    collectionName: collectionNames.ERROR_COLLECTION,
    data: errorEntity,
  });

  return errorEntity;
};
