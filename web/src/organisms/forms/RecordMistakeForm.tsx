import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  FormControl,
  TextField,
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { v4 } from "uuid";
import { PrimaryButton } from "atoms";
import AddIcon from "@mui/icons-material/Add";
import { useAppStore } from "contexts";
import { updateDocument, CollectionNames } from "databases/firestore";
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
    title: string;
    description: string;
    tags: string[];
    createdAt: number;
  }) => void;
}) => {
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const updateIsOpenRecordMistakeForm = useAppStore(
    (state) => state.updateIsOpenRecordMistakeForm
  );

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentSelectedTags, setCurrentSelectedTags] = useState(["default"]);
  const isAbleToAddMoreCategory = user && user.tags.length <= 10;
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
        title,
        description,
        tags: currentSelectedTags,
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
          {isAddingCategory ? (
            <ClickAwayListener
              onClickAway={async () => {
                setIsAddingCategory(false);
                if (user && newCategoryName) {
                  // update global app state
                  updateUser({
                    ...user,
                    tags: [...user.tags, newCategoryName],
                  });

                  // update firestore
                  await updateDocument({
                    collectionName: CollectionNames.USERS,
                    updatedData: {
                      tags: [...user.tags, newCategoryName],
                    },
                    id: user.id,
                  });
                }
              }}
            >
              <TextField
                label="New Category"
                variant="standard"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                inputRef={(input) => input && input.focus()}
              />
            </ClickAwayListener>
          ) : isAbleToAddMoreCategory ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: "flex", alignItems: "center" }}
              onClick={() => {
                setIsAddingCategory(true);
              }}
            >
              <AddIcon />
            </IconButton>
          ) : null}
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
            setCurrentSelectedTags(["default"]);
            updateIsOpenRecordMistakeForm(false);
          }}
        />
      </Box>
    </form>
  );
};

export default RecordMistakeForm;
