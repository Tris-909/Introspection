import { randomUUID } from "crypto";
import { createDoc } from "../../utils";
import { CollectionDatabaseNames } from "../../types";

interface CreateErrorArgs {
  title: string;
  description: string;
  tags: string[];
}

export const createError = async ({
  title,
  description,
  tags,
}: CreateErrorArgs) => {
  const errorEntity = {
    id: randomUUID(),
    title: title,
    description: description,
    tags: tags,
    createdAt: Date.now(),
  };

  await createDoc({
    collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
    data: errorEntity,
  });

  return errorEntity;
};
