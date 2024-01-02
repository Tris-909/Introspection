import { updateDocById } from "../../utils";
import { collectionNames } from "../../databases/firebase";

export const patchError = async ({ id, data }) => {
  const updatedItem = await updateDocById({
    collectionName: collectionNames.ERROR_COLLECTION,
    id: id,
    data: data,
  });

  return updatedItem;
};
