import { firestore } from "../databases/firebase";
import { universalValidationCodes } from "../validations/shared/universalCodes";

export const createDoc = async ({ collectionName, data }) => {
  try {
    // create a document with id {data.id} inside collection { collectionName }
    await firestore.collection(collectionName).doc(data.id).set(data);
  } catch (error) {
    throw new Error(error);
  }
};

export const readDocById = async ({ collectionName, id }) => {
  try {
    const itemRef = await firestore.collection(collectionName).doc(id);
    const item = await itemRef.get();

    if (!item.exists) {
      throw {
        statusCode: 404,
        errors: [
          {
            code: universalValidationCodes.NOT_FOUND,
            message: `Can't find item with ID ${id}`,
          },
        ],
      };
    } else {
      return item.data();
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const readDocs = async ({ collectionName, conditions }) => {
  try {
    const itemRef = firestore.collection(collectionName);

    for (let i = 0; i < conditions.length; i++) {
      const { field, queryOperator, value } = conditions[i];
      itemRef = itemRef.where(field, queryOperator, value);
    }

    const snapshot = await itemRef.limit(3).get();
    const last = snapshot.docs[snapshot.docs.length - 1];

    console.log("last", last);

    const next = firestore
      .collection(collectionName)
      .startAfter(last.data().population)
      .limit(3);

    console.log("next", next);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateDocById = async ({ collectionName, id, data }) => {
  try {
    // if { data } is an object contains field with new value it will update that field with new value
    await firestore
      .collection(collectionName)
      .doc(id)
      .update({
        ...data,
        updatedAt: Date.now(),
      });

    const doc = await readDocById({ collectionName, id });

    return doc;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteDocById = async ({ collectionName, id }) => {
  try {
    await firestore.collection(collectionName).doc(id).delete();
  } catch (error) {
    throw new Error(error);
  }
};
