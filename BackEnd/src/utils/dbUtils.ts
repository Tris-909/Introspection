import { firestore } from "../databases";
import {
  CollectionDatabaseNames,
  ValidationCodes,
  ErrorEntity,
} from "../types";

export const createDoc = async ({
  collectionName,
  data,
}: {
  collectionName: CollectionDatabaseNames;
  data: Record<string, any>;
}) => {
  try {
    // create a document with id {data.id} inside collection { collectionName }
    await firestore.collection(collectionName).doc(data.id).set(data);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const readDocById = async ({
  collectionName,
  id,
}: {
  collectionName: CollectionDatabaseNames;
  id: string;
}): Promise<ErrorEntity> => {
  try {
    const itemRef = await firestore.collection(collectionName).doc(id);
    const item = await itemRef.get();

    if (!item.exists) {
      throw {
        statusCode: 404,
        errors: [
          {
            code: ValidationCodes.NOT_FOUND,
            message: `Can't find item with ID ${id}`,
          },
        ],
      };
    } else {
      return item.data() as ErrorEntity;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

// TODO: TO BE REFINED FOR PAGINATION AND MORE COMPLEX QUERIES
// export const readDocs = async ({
//   collectionName,
//   conditions,
// }: {
//   collectionName: CollectionDatabaseNames;
//   conditions: {
//     field: string;
//     queryOperator: string;
//     value: any;
//   }[];
// }) => {
//   try {
//     let itemRef = firestore.collection(collectionName);

//     for (let i = 0; i < conditions.length; i++) {
//       const { field, queryOperator, value } = conditions[i];
//       itemRef = itemRef.where(field, queryOperator, value);
//     }

//     const snapshot = await itemRef.limit(3).get();
//     const last = snapshot.docs[snapshot.docs.length - 1];

//     console.log("last", last);

//     const next = firestore
//       .collection(collectionName)
//       .startAfter(last.data().population)
//       .limit(3);

//     console.log("next", next);
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

export const updateDocById = async ({
  collectionName,
  id,
  data,
}: {
  collectionName: CollectionDatabaseNames;
  id: string;
  data: Record<string, any>;
}) => {
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
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteDocById = async ({
  collectionName,
  id,
}: {
  collectionName: CollectionDatabaseNames;
  id: string;
}) => {
  try {
    await firestore.collection(collectionName).doc(id).delete();
  } catch (error: any) {
    throw new Error(error);
  }
};
