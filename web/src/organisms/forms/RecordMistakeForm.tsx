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
import { v4 } from "uuid";
import { PrimaryButton } from "atoms";
import { useAppStore } from "contexts";
import useMediaQuery from "@mui/material/useMediaQuery";

const RecordMistakeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const RecordMistakeForm = ({
  recordMistakeHandler,
}: {
  recordMistakeHandler: (data: {
    id: string;
    userId: string;
    title: string;
    description: string;
    tags: string[];
    repetitions: {
      title: string;
      createdAt: number;
    }[];
    createdAt: number;
  }) => void;
}) => {
  const user = useAppStore((state) => state.user);
  const updateIsOpenRecordMistakeForm = useAppStore(
    (state) => state.updateIsOpenRecordMistakeForm
  );

  const [currentSelectedTags, setCurrentSelectedTags] = useState(["default"]);
  const isSmaller900px = useMediaQuery("(max-width: 900px)");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: RecordMistakeSchema,
    onSubmit: async (values, { setValues }): Promise<void> => {
      const { title, description } = values;
      recordMistakeHandler({
        id: v4(),
        userId: user!.id,
        title,
        description,
        tags: currentSelectedTags,
        repetitions: [
          {
            title: "First time",
            createdAt: Date.now(),
          },
        ],
        createdAt: Date.now(),
      });

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
          {user &&
            user.tags.map((tag: string) => (
              <FormControlLabel
                key={tag}
                control={
                  <Checkbox
                    value={tag}
                    defaultChecked={tag === "default"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const alreadyHaveThisTag =
                          currentSelectedTags.includes(tag);

                        if (!alreadyHaveThisTag) {
                          setCurrentSelectedTags([...currentSelectedTags, tag]);
                        }
                      } else {
                        const newCurrentSelectedTags =
                          currentSelectedTags.filter(
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
