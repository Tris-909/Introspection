import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { PrimaryButton } from "atoms";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Mistake } from "types";
import { useAppStore } from "contexts";
import { CollectionNames, updateDocument } from "databases/firestore";
import { sendCustomNotification, ToastTypes } from "utils";
import dayjs from "dayjs";
import { sharedColor } from "consts";

interface MistakeItemProps {
  mistake: Mistake;
  setConfirmDelete: (confirmDelete: boolean) => void;
  setDeleteMistakeId: (deleteMistakeId: string) => void;
}

const MistakeItemAccordion = ({
  mistake,
  setConfirmDelete,
  setDeleteMistakeId,
}: MistakeItemProps) => {
  const {
    mistakes,
    updateMistakes,
    updateIsOpenUpdateMistakeDialog,
    updateEditMistakeId,
    updateIsOpenAddRepetitionDialog,
    updateIsEditRepetition,
    updateEditRepetitionId,
  } = useAppStore();

  const deleteRepetitionHandler = async (
    mistakeId: string,
    repetitionId: string
  ) => {
    // Update app state
    const mistakeIndex = mistakes.findIndex(
      (mistake) => mistake.id === mistakeId
    );
    const relatedMistake = mistakes.filter(
      (mistake) => mistake.id === mistakeId
    )[0];
    let repetitionsOfMistake = relatedMistake.repetitions.filter(
      (repetition) => repetition.id !== repetitionId
    );
    relatedMistake.repetitions = repetitionsOfMistake;
    mistakes[mistakeIndex] = relatedMistake;
    updateMistakes(mistakes);

    // Update Repetition inside a Mistake in FireStore
    await updateDocument({
      collectionName: CollectionNames.ERRRORS,
      id: mistakeId,
      updatedData: {
        repetitions: repetitionsOfMistake,
      },
    });

    // Notify customer
    sendCustomNotification({
      message: "Delete repetition of a mistake successfully",
      type: ToastTypes.success,
    });
  };

  const removeMistake = async (id: string) => {
    setConfirmDelete(true);
    setDeleteMistakeId(id);
  };

  return (
    <Accordion
      key={mistake.id}
      sx={{ width: "100%", marginBottom: 3 }}
      elevation={3}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            fontSize={26}
            fontFamily={"Josefin Slab"}
            fontWeight={600}
          >
            {mistake.title}
          </Typography>
          <Typography> {mistake.description}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: 200, overflow: "auto" }}>
        {mistake.repetitions.map((repetition, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    updateIsEditRepetition(true);
                    updateEditMistakeId(mistake.id);
                    updateEditRepetitionId(repetition.id);
                    updateIsOpenAddRepetitionDialog(true);
                  }}
                  sx={{
                    marginRight: 1,
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    deleteRepetitionHandler(mistake.id, repetition.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
            sx={{ borderTop: "1px solid #ccc" }}
          >
            <ListItemText
              primary={repetition.title}
              secondary={dayjs(repetition.createdAt).format("DD/MM/YYYY")}
            />
          </ListItem>
        ))}
      </AccordionDetails>
      <AccordionActions>
        <PrimaryButton
          title="Repeat"
          clickHandler={() => {
            updateEditMistakeId(mistake.id);
            updateIsOpenAddRepetitionDialog(true);
          }}
          style={{
            borderColor: sharedColor.button.warning,
            color: sharedColor.button.warning,
            "&:hover": {
              borderColor: sharedColor.button.warning,
              color: sharedColor.button.warning,
            },
          }}
        />
        <PrimaryButton
          title="Edit"
          clickHandler={() => {
            updateEditMistakeId(mistake.id);
            updateIsOpenUpdateMistakeDialog(true);
          }}
          style={{
            borderColor: sharedColor.button.info,
            color: sharedColor.button.info,
            "&:hover": {
              borderColor: sharedColor.button.info,
              color: sharedColor.button.info,
            },
          }}
        />
        <PrimaryButton
          title="Delete"
          clickHandler={() => {
            removeMistake(mistake.id);
          }}
          style={{
            borderColor: sharedColor.button.alert,
            color: sharedColor.button.alert,
            "&:hover": {
              borderColor: sharedColor.button.alert,
              color: sharedColor.button.alert,
            },
          }}
        />
      </AccordionActions>
    </Accordion>
  );
};

export default MistakeItemAccordion;
