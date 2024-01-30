import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  FormControl,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PrimaryButton } from "atoms";
import { useAppStore } from "contexts";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

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
      tags: string;
      createdAt: number;
    }
  ) => void;
}) => {
  const { user, editMistakeId, mistakes, updateIsOpenUpdateMistakeDialog } =
    useAppStore();
  const editMistake = mistakes.filter(
    (mistake) => mistake.id === editMistakeId
  )[0];
  const [selectedDate, setSelectDate] = React.useState<number | Dayjs>(
    dayjs(editMistake.createdAt)
  );

  const formik = useFormik({
    initialValues: {
      title: editMistake.title,
      description: editMistake.description,
      selectedCategory: editMistake.category,
    },
    validationSchema: RecordMistakeSchema,
    onSubmit: async (values, { setValues }): Promise<void> => {
      const { title, description, selectedCategory } = values;
      if (selectedDate) {
        updateMistakeHandler(editMistakeId, {
          title,
          description,
          tags: selectedCategory,
          createdAt: selectedDate.valueOf() as number,
        });
      }

      setValues({ title: "", description: "", selectedCategory: "default" });
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
        <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
          <InputLabel>Selected Category</InputLabel>
          <Select
            value={formik.values.selectedCategory}
            label="Category"
            onChange={(e) => {
              formik.setFieldValue("selectedCategory", e.target.value);
            }}
          >
            {user &&
              user.categories.map((category: string) => (
                <MenuItem value={category} key={category}>
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
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
            updateIsOpenUpdateMistakeDialog(false);
          }}
        />
      </Box>
    </form>
  );
};

export default UpdateMistakeForm;
