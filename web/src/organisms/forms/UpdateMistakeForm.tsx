import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  FormControl,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { PrimaryButton } from "atoms";
import { useAppStore } from "contexts";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RecordMistakeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const UpdateMistakeForm = ({
  updateMistakeHandler,
}: {
  updateMistakeHandler: (
    updateId: string,
    data: {
      title: string;
      description: string;
      tags: string[];
      createdAt: number;
    }
  ) => void;
}) => {
  const user = useAppStore((state) => state.user);
  const editMistakeId = useAppStore((state) => state.editMistakeId);
  const mistakes = useAppStore((state) => state.mistakes);
  const editMistake = mistakes.filter(
    (mistake) => mistake.id === editMistakeId
  )[0];
  const updateIsOpenUpdateMistakeDialog = useAppStore(
    (state) => state.updateIsOpenUpdateMistakeDialog
  );

  const [currentSelectedTags, setCurrentSelectedTags] = useState(
    editMistake.tags
  );
  const [selectedDate, setSelectDate] = React.useState<number | Dayjs>(
    dayjs(editMistake.createdAt)
  );

  const isSmaller900px = useMediaQuery("(max-width: 900px)");

  const formik = useFormik({
    initialValues: {
      title: editMistake.title,
      description: editMistake.description,
    },
    validationSchema: RecordMistakeSchema,
    onSubmit: async (values, { setValues }): Promise<void> => {
      const { title, description } = values;
      if (selectedDate) {
        updateMistakeHandler(editMistakeId, {
          title,
          description,
          tags: currentSelectedTags,
          createdAt: selectedDate.valueOf() as number,
        });
      }

      setValues({ title: "", description: "" });
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
        <Box
          display={"flex"}
          mb={2}
          flexDirection={isSmaller900px ? "row" : "row"}
          flexWrap={isSmaller900px ? "wrap" : "nowrap"}
        >
          {currentSelectedTags.map((tag: string) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  value={tag}
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const alreadyHaveThisTag =
                        currentSelectedTags.includes(tag);

                      if (!alreadyHaveThisTag) {
                        setCurrentSelectedTags([...currentSelectedTags, tag]);
                      }
                    } else {
                      const newCurrentSelectedTags = currentSelectedTags.filter(
                        (tag) => tag !== e.target.value
                      );
                      setCurrentSelectedTags(newCurrentSelectedTags);
                    }
                  }}
                />
              }
              label={tag}
            />
          ))}
        </Box>
        <FormControl sx={{ width: "100%", mb: 3 }}>
          <TextField
            variant="outlined"
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.errors.description}
            multiline
            rows={10}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
          />
        </FormControl>
        <DatePicker
          label="Controlled picker"
          value={selectedDate}
          onChange={(newValue: any) => {
            setSelectDate(dayjs(newValue).valueOf());
          }}
        />
        <PrimaryButton
          title="Submit"
          style={{ alignSelf: "flex-end", marginTop: 2 }}
          clickHandler={() => {
            updateIsOpenUpdateMistakeDialog(false);
          }}
        />
      </Box>
    </form>
  );
};

export default UpdateMistakeForm;
