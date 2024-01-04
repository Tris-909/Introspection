import dotenv from "dotenv";
dotenv.config();

import { readDocs, updateDocById } from "utils";
const { CollectionDatabaseNames } = require("../types/index.ts");

const updateBulkTitles = async () => {
  try {
    const docs = await readDocs({
      collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
      conditions: [
        {
          field: "createdAt",
          queryOperator: ">=",
          value: 1704005774700,
        },
      ],
    });
    console.log("Query items successfully", docs);

    for (let i = 0; i < docs.length; i++) {
      await updateDocById({
        collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
        id: docs[i].id,
        data: {
          title: `NEW TITLE ${i}+`,
        },
      });
      console.log(`Update Error Entity with ID(${docs[i].id}) successfully !`);
    }
  } catch (error) {
    console.log("fail", error);
  }
};

updateBulkTitles();
