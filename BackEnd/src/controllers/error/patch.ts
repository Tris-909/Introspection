import { updateDocById } from "utils";
import { CollectionDatabaseNames } from "types";

export const patchError = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
  const updatedItem = await updateDocById({
    collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
    id: id,
    data: data,
  });

  return updatedItem;
};
