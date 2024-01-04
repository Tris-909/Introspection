import { readDocById } from "utils";
import { CollectionDatabaseNames } from "types";

export const readError = async (id: string) => {
  const error = await readDocById({
    collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
    id: id,
  });

  return error;
};
