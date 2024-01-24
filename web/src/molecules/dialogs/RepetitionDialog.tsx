import React from "react";
import CustomDialog from "./CustomDialog";
import { RepetitionForm } from "organisms";
import { useAppStore } from "contexts";
import { updateDocument, CollectionNames } from "databases/firestore";
import { sendCustomNotification, ToastTypes } from "utils";

const RepetitionDialog = () => {
  const {
    isOpenAddRepetitionDialog,
    updateIsOpenAddRepetitionDialog,
    mistakes,
    updateMistakes,
    isEditRepetition,
  } = useAppStore();

  const repetitionHandler = async (
    updateId: string,
    data: {
      repetitions: { id: string; title: string; createdAt: number }[];
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
      message: isEditRepetition
        ? "Edit a repetition successfully"
        : "Adding a repetition successfully",
      type: ToastTypes.success,
    });
  };

  return (
    <CustomDialog
      title={isEditRepetition ? "Edit Repetition" : "Add Repetition"}
      open={isOpenAddRepetitionDialog}
      setOpen={updateIsOpenAddRepetitionDialog}
    >
      <RepetitionForm repetitionHandler={repetitionHandler} />
    </CustomDialog>
  );
};

export default RepetitionDialog;
