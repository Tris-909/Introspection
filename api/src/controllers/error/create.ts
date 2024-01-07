import { randomUUID } from "crypto";
import { CollectionDatabaseNames } from "types";
import { createDoc } from "utils";

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
