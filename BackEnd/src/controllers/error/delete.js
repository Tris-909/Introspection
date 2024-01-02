import { deleteDocById } from "../../utils";
import { collectionNames } from "../../databases/firebase";

export const deleteError = async ({ id }) => {
  await deleteDocById({
    collectionName: collectionNames.ERROR_COLLECTION,
    id: id,
  });
};
