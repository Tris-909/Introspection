import { collectionNames } from "../../databases/firebase.js";
import { readDocById } from "../../utils";

export const readError = async (id) => {
  const error = await readDocById({
    collectionName: collectionNames.ERROR_COLLECTION,
    id: id,
  });

  return error;
};
