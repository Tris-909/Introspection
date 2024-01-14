import React, { useState } from "react";
import { CustomDialog } from "molecules";
import { RecordMistakeForm } from "organisms";
import { useAppStore } from "contexts";
import { sendCustomNotification, ToastTypes } from "utils";
import { CollectionNames, createDocument } from "databases/firestore";

const RecordMistakeDialog = () => {
  const isOpenRecordMistakeForm = useAppStore(
    (state) => state.isOpenRecordMistakeForm
  );
  const updateIsOpenRecordMistakeForm = useAppStore(
    (state) => state.updateIsOpenRecordMistakeForm
  );

  const recordMistakeHandler = async (data: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: number;
  }) => {
    try {
      await createDocument({
        collectionName: CollectionNames.ERRRORS,
        data: data,
      });
      updateIsOpenRecordMistakeForm(false);
    } catch (error: any) {
      sendCustomNotification({
        message: "Something is wrong, please try again later",
        type: ToastTypes.error,
      });
    }
  };

  return (
    <CustomDialog
      title="Record Your Mistake"
      open={isOpenRecordMistakeForm}
      setOpen={updateIsOpenRecordMistakeForm}
    >
      <RecordMistakeForm recordMistakeHandler={recordMistakeHandler} />
    </CustomDialog>
  );
};

export default RecordMistakeDialog;
