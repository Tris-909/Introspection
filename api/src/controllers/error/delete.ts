import { deleteDocById } from "utils";
import { CollectionDatabaseNames } from "types";

export const deleteError = async ({ id }: { id: string }) => {
  await deleteDocById({
    collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
    id: id,
  });
};
