import React, { useState } from "react";
import * as Yup from "yup";
import { FormikContext, useFormik } from "formik";
import {
  FormControl,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { v4 } from "uuid";
import { PrimaryButton } from "atoms";
import { useAppStore } from "contexts";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Mistake } from "types";

const RecordMistakeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const RecordMistakeForm = ({
  recordMistakeHandler,
}: {
  recordMistakeHandler: (data: Mistake) => void;
}) => {
  const { user, updateIsOpenRecordMistakeForm } = useAppStore();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      selectedCategory: "Default",
    },
    validationSchema: RecordMistakeSchema,
    onSubmit: async (values, { setValues }): Promise<void> => {
      const { title, description, selectedCategory } = values;
      recordMistakeHandler({
        id: v4(),
        userId: user!.id,
        title,
        description,
        category: selectedCategory,
        repetitions: [
          {
            id: v4(),
            title: "First time",
            createdAt: Date.now(),
          },
        ],
        createdAt: Date.now(),
      });

      setValues({ title: "", description: "", selectedCategory: "Default" });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        <FormControl sx={{ width: "100%", mb: 1, mt: 1 }}>
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
          <InputLabel>Category</InputLabel>
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
        <PrimaryButton
          title="Submit"
          style={{ alignSelf: "flex-end" }}
          clickHandler={() => {
            updateIsOpenRecordMistakeForm(false);
          }}
        />
      </Box>
    </form>
  );
};

export default RecordMistakeForm;
