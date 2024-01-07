import { firestore } from "databases";
import { CollectionDatabaseNames, ValidationCodes, ErrorEntity } from "types";
import {
  WhereFilterOp,
  Query,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

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

const getCollection = (collectionName: string): Query<DocumentData> => {
  return firestore.collection(collectionName);
};

// TODO: TO BE REFINED FOR PAGINATION AND MORE COMPLEX QUERIES
export const readDocs = async ({
  collectionName,
  conditions,
  currentItems = [],
  cursor = null,
}: {
  collectionName: CollectionDatabaseNames;
  conditions: {
    field: string;
    queryOperator: WhereFilterOp;
    value: any;
  }[];
  currentItems?: Record<string, any>[];
  cursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
}): Promise<any> => {
  const ITEM_LIMIT_PER_QUERY = 3;
  try {
    if (cursor) {
      let itemRef = getCollection(collectionName);

      for (let i = 0; i < conditions.length; i++) {
        const { field, queryOperator, value } = conditions[i];
        itemRef = itemRef.where(field, queryOperator, value);
      }

      const next = await itemRef
        .orderBy("createdAt")
        .startAfter(cursor.data().createdAt)
        .limit(3)
        .get();

      if (next.empty) {
        return currentItems;
      }

      next.forEach((doc) => {
        currentItems.push(doc.data());
      });

      const last = next.docs[next.docs.length - 1];
      if (!last.data()) {
        return currentItems;
      }

      return readDocs({
        collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
        conditions: conditions,
        currentItems: currentItems,
        cursor: last,
      });
    } else {
      let itemRef = getCollection(collectionName);

      for (let i = 0; i < conditions.length; i++) {
        const { field, queryOperator, value } = conditions[i];
        itemRef = itemRef.where(field, queryOperator, value);
      }

      const snapshot = await itemRef.limit(ITEM_LIMIT_PER_QUERY).get();

      if (snapshot.empty) {
        return currentItems;
      } else {
        snapshot.forEach((doc) => {
          currentItems.push(doc.data());
        });

        const last = snapshot.docs[snapshot.docs.length - 1];

        return readDocs({
          collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
          conditions: conditions,
          currentItems: currentItems,
          cursor: last,
        });
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

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
