import { firestore } from "../../databases/firebase.js";
import { errorValidationCodes } from "../../validations/errors/codes.js";

export const readError = async (id) => {
  const errorQuerySnapShoot = await firestore
    .collection("errors")
    .where("id", "==", id)
    .get();
  const errorEntity = errorQuerySnapShoot.docs[0]?.data();

  if (!errorEntity) {
    throw {
      statusCode: 404,
      errors: [
        {
          code: errorValidationCodes.NOT_FOUND,
          message: `Can't find an error item with ID ${id}`,
        },
      ],
    };
  }

  return errorEntity;
};
