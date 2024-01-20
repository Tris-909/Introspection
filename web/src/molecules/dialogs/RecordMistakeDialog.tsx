import React, { useState } from "react";
import { CustomDialog } from "molecules";
import { RecordMistakeForm } from "organisms";
import { useAppStore } from "contexts";
import { sendCustomNotification, ToastTypes } from "utils";
import { CollectionNames, createDocument } from "databases/firestore";
import { Mistake } from "types";

const RecordMistakeDialog = () => {
  const isOpenRecordMistakeForm = useAppStore(
    (state) => state.isOpenRecordMistakeForm
  );
  const updateIsOpenRecordMistakeForm = useAppStore(
    (state) => state.updateIsOpenRecordMistakeForm
  );
  const mistakes = useAppStore((state) => state.mistakes);
  const updateMistakes = useAppStore((state) => state.updateMistakes);

  const recordMistakeHandler = async (data: Mistake) => {
    try {
      await createDocument({
        collectionName: CollectionNames.ERRRORS,
        data: data as any,
      });
      updateMistakes([data, ...mistakes]);
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
