import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  collection,
  WhereFilterOp,
  DocumentSnapshot,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "databases/firebase";
import { sendCustomNotification, ToastTypes } from "utils";

interface Condition {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

interface QueryResult {
  items: any[];
  totalCount: number;
}

export enum CollectionNames {
  USERS = "users",
  ERRRORS = "errors",
}

export const getDocumentById = async ({
  collectionName,
  id,
}: {
  id: string;
  collectionName: CollectionNames;
}) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    sendCustomNotification({
      message: "Something is wrong, please try again later",
      type: ToastTypes.error,
    });
  }
};

export const createDocument = async ({
  collectionName,
  data,
}: {
  collectionName: CollectionNames;
  data: Record<string, unknown>;
}) => {
  try {
    await setDoc(doc(db, collectionName, data.id as string), data);
  } catch (error) {
    sendCustomNotification({
      message: "Something is wrong, please try again later",
      type: ToastTypes.error,
    });
  }
};

export const updateDocument = async ({
  collectionName,
  updatedData,
  id,
}: {
  collectionName: CollectionNames;
  updatedData: Record<string, unknown>;
  id: string;
}) => {
  try {
    await updateDoc(
      doc(db, collectionName, id),
      updatedData as Partial<unknown>
    );
  } catch (error) {
    sendCustomNotification({
      message: "Something is wrong, please try again later",
      type: ToastTypes.error,
    });
  }
};

export const deleteDocument = async ({
  collectionName,
  id,
}: {
  collectionName: CollectionNames;
  id: string;
}) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    sendCustomNotification({
      message: "Something is wrong, please try again later",
      type: ToastTypes.error,
    });
  }
};

export const getDocuments = async ({
  collectionName,
  conditions,
  orderByField,
  lastVisibleDocument,
  accumulatedResult = { items: [], totalCount: 0 },
}: {
  collectionName: CollectionNames;
  conditions: Condition[];
  orderByField: string;
  lastVisibleDocument: DocumentSnapshot | null;
  accumulatedResult: QueryResult;
}): Promise<QueryResult> => {
  const pageSize = 10;
  try {
    let q = query(
      collection(db, collectionName),
      ...conditions.map(({ field, operator, value }) =>
        where(field, operator, value)
      ),
      orderBy(orderByField)
    );

    if (lastVisibleDocument) {
      q = query(q, startAfter(lastVisibleDocument));
    }

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      accumulatedResult.items.push(doc.data());
    });
    accumulatedResult.totalCount += querySnapshot.size;

    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

    if (lastDocument) {
      return getDocuments({
        collectionName,
        conditions,
        orderByField,
        lastVisibleDocument,
        accumulatedResult,
      });
    }

    return accumulatedResult;
  } catch (error) {
    sendCustomNotification({
      message: "Something is wrong, please try again later",
      type: ToastTypes.error,
    });

    throw new Error("Something is wrong, please try again later");
  }
};