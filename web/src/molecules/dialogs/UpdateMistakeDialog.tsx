import React from "react";
import { CustomDialog } from "molecules";
import { useAppStore } from "contexts";
import { UpdateMistakeForm } from "organisms";
import { updateDocument, CollectionNames } from "databases/firestore";
import { sendCustomNotification, ToastTypes } from "utils";

const UpdateMistakeDialog = () => {
  const isOpenUpdateMistakeDialog = useAppStore(
    (state) => state.isOpenUpdateMistakeDialog
  );
  const updateIsOpenUpdateMistakeDialog = useAppStore(
    (state) => state.updateIsOpenUpdateMistakeDialog
  );
  const mistakes = useAppStore((state) => state.mistakes);
  const updateMistakes = useAppStore((state) => state.updateMistakes);

  const updateMistakeHandler = async (
    updateId: string,
    data: {
      title: string;
      description: string;
      tags: string[];
      createdAt: number;
    }
  ) => {
    let editMistake = mistakes.filter((mistake) => mistake.id === updateId)[0];
    editMistake = {
      ...editMistake,
      ...data,
    };
    const updateIndex = mistakes.findIndex(
      (mistake) => mistake.id === updateId
    );
    const currentMistakesArr = mistakes;
    currentMistakesArr[updateIndex] = editMistake;
    updateMistakes(currentMistakesArr);

    await updateDocument({
      collectionName: CollectionNames.ERRRORS,
      id: updateId,
      updatedData: data,
    });

    sendCustomNotification({
      message: "Update mistake successfully",
      type: ToastTypes.success,
    });
  };

  return (
    <CustomDialog
      title="Edit Mistake"
      open={isOpenUpdateMistakeDialog}
      setOpen={updateIsOpenUpdateMistakeDialog}
    >
      <UpdateMistakeForm updateMistakeHandler={updateMistakeHandler} />
    </CustomDialog>
  );
};

export default UpdateMistakeDialog;
