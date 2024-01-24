import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormControl, TextField, Box } from "@mui/material";
import { PrimaryButton } from "atoms";
import { useAppStore } from "contexts";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { v4 } from "uuid";

const AddRepetitionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const RepetitionForm = ({
  repetitionHandler,
}: {
  repetitionHandler: (
    updateId: string,
    data: {
      repetitions: { id: string; title: string; createdAt: number }[];
    }
  ) => void;
}) => {
  const {
    editMistakeId,
    mistakes,
    updateIsOpenAddRepetitionDialog,
    isEditRepetition,
    editRepetitionId,
  } = useAppStore();

  const editMistake = mistakes.filter(
    (mistake) => mistake.id === editMistakeId
  )[0];
  const editRepetition = editMistake.repetitions.filter(
    (repetition) => repetition.id === editRepetitionId
  )[0];
  const [selectedDate, setSelectDate] = React.useState<number | Dayjs>(
    isEditRepetition ? dayjs(editRepetition.createdAt) : dayjs()
  );

  const formik = useFormik({
    initialValues: {
      title: isEditRepetition ? editRepetition.title : "",
    },
    validationSchema: AddRepetitionSchema,
    onSubmit: async (values): Promise<void> => {
      const { title } = values;
      if (selectedDate) {
        let currentEditRepetitions = editMistake.repetitions;

        if (isEditRepetition) {
          const newRepetition = {
            ...editRepetition,
            title: title,
            createdAt: selectedDate.valueOf(),
          };
          const repetitionIndex = currentEditRepetitions.findIndex(
            (repetition) => repetition.id === editRepetitionId
          );
          currentEditRepetitions[repetitionIndex] = newRepetition;
        }

        const newAddedRepetitions = [
          { id: v4(), title, createdAt: selectedDate.valueOf() },
          ...editMistake.repetitions,
        ];

        repetitionHandler(editMistakeId, {
          repetitions: isEditRepetition
            ? currentEditRepetitions
            : newAddedRepetitions,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        <FormControl sx={{ width: "100%", mb: 1 }}>
          <TextField
            variant="outlined"
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.errors.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
          />
        </FormControl>
        <DatePicker
          label="Created At"
          value={selectedDate}
          onChange={(newValue: any) => {
            setSelectDate(dayjs(newValue).valueOf());
          }}
        />

        <PrimaryButton
          title="Submit"
          style={{ alignSelf: "flex-end", marginTop: 2 }}
          clickHandler={() => {
            updateIsOpenAddRepetitionDialog(false);
          }}
        />
      </Box>
    </form>
  );
};

export default RepetitionForm;
