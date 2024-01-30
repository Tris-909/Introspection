import React, { useState, useEffect } from "react";
import CustomDialog from "./CustomDialog";
import { useAppStore } from "contexts";
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import { PrimaryButton } from "atoms";
import { sharedColor } from "consts";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { ClickAwayListener } from "@mui/base";
import {
  updateDocument,
  getDocuments,
  CollectionNames,
} from "databases/firestore";
import { sendCustomNotification, ToastTypes } from "utils";

const ManageCategoriesDialog = () => {
  const {
    user,
    isOpenManageCategoriesDialog,
    updateIsOpenManageCategoriesDialog,
  } = useAppStore();

  const [categories, setCategories] = useState<string[]>([]);
  const [updateTag, setUpdateTag] = useState<string>("");
  const [isEdit, setIsEdit] = useState<string>("");
  const [createTag, setCreateTag] = useState<string>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const categoryWithoutDefault = user.categories.filter(
        (category: string) => category !== "default"
      );
      setCategories(categoryWithoutDefault);
    }
  }, [user]);

  const createTagHandler = async () => {
    if (createTag.length <= 20 && createTag.length >= 0) {
      const newTagList = [...categories, createTag];

      // Update tags list in User entity FireStore
      await updateDocument({
        collectionName: CollectionNames.USERS,
        id: user!.id,
        updatedData: {
          categories: newTagList,
        },
      });

      // Update app state
      setCategories(newTagList);
      setIsCreate(false);

      // Notify customer
      sendCustomNotification({
        message: "Create category successfully",
        type: ToastTypes.success,
      });
    }
  };

  const editTagHandler = async () => {
    const updateIndex = categories.findIndex((category) => category === isEdit);
    const copyTags = categories;
    copyTags[updateIndex] = updateTag;

    // Update tags list on user
    await updateDocument({
      collectionName: CollectionNames.USERS,
      id: user!.id,
      updatedData: {
        categories: copyTags,
      },
    });

    // Update all `Mistake` with this tag
    await updateRelatedMistakes(isEdit, updateTag);

    // Update tag list in app state
    setCategories(copyTags);
    setIsEdit("");

    // Notify customer
    sendCustomNotification({
      message: "Update category successfully along with all related Mistakes",
      type: ToastTypes.success,
    });
  };

  const removeTagHandler = async (removedTag: string) => {
    // remove the tag from tag list from app state
    const newTags = categories.filter((category) => category !== removedTag);
    setCategories(newTags);

    // remove the tag from tag list from the user entity in firestore
    await updateDocument({
      collectionName: CollectionNames.USERS,
      id: user!.id,
      updatedData: {
        tags: newTags,
      },
    });

    // remove the tag from tag list from every mistakes entity in firestore
    await updateRelatedMistakes(removedTag, null);

    // notify customer
    sendCustomNotification({
      message: `Delete category ${removedTag} successfully and Update all related Mistakes`,
      type: ToastTypes.success,
    });
  };

  const updateRelatedMistakes = async (
    oldTag: string,
    newTag: string | null
  ) => {
    // Get All related Mistakes
    const { items } = await getDocuments({
      collectionName: CollectionNames.ERRRORS,
      conditions: [
        {
          field: "tags",
          operator: "array-contains",
          value: oldTag,
        },
        {
          field: "userId",
          operator: "==",
          value: user?.id,
        },
      ],
      orderByField: "createdAt",
      lastVisibleDocument: null,
    });

    // Loop through Mistakes list and update them one by one with new tag
    for (let i = 0; i < items.length; i++) {
      let currentTagListOfMistake = items[i].tags;

      if (newTag) {
        const updateIndex = currentTagListOfMistake.findIndex(
          (tag: string) => tag === oldTag
        );
        currentTagListOfMistake[updateIndex] = newTag;
      } else {
        currentTagListOfMistake = currentTagListOfMistake.filter(
          (tag: string) => tag !== oldTag
        );
      }

      console.log("currentTagListOfMistake", currentTagListOfMistake);

      await updateDocument({
        collectionName: CollectionNames.ERRRORS,
        id: items[i].id,
        updatedData: {
          tags: currentTagListOfMistake,
        },
      });
    }
  };

  return (
    <CustomDialog
      title="Manage Categories"
      open={isOpenManageCategoriesDialog}
      setOpen={updateIsOpenManageCategoriesDialog}
    >
      <Box display={"flex"} flexDirection={"column"}>
        {categories.length > 0 &&
          categories.map((category: string, index: number) => {
            if (category) {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      {category !== "Default" && (
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          sx={{ mr: 1 }}
                          onClick={() => {
                            setIsEdit(category);
                            setUpdateTag(category);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}

                      {category !== "Default" && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            removeTagHandler(category);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                    </>
                  }
                >
                  {isEdit === category ? (
                    <ClickAwayListener
                      onClickAway={() => {
                        editTagHandler();
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        value={updateTag}
                        onChange={(e) => setUpdateTag(e.target.value)}
                      />
                    </ClickAwayListener>
                  ) : (
                    <ListItemText primary={category} />
                  )}
                </ListItem>
              );
            }
            return null;
          })}
        {isCreate && (
          <ClickAwayListener
            onClickAway={() => {
              createTagHandler();
            }}
          >
            <TextField
              id="standard-basic"
              variant="standard"
              placeholder="New Category"
              sx={{
                marginTop: 3,
              }}
              value={createTag}
              onChange={(e) => setCreateTag(e.target.value)}
            />
          </ClickAwayListener>
        )}
        <PrimaryButton
          title="Add new category"
          clickHandler={() => {
            setCreateTag("");
            setIsCreate(true);
          }}
          style={{
            borderColor: sharedColor.button.info,
            color: sharedColor.button.info,
            "&:hover": {
              borderColor: sharedColor.button.info,
              color: sharedColor.button.info,
            },
            alignSelf: "flex-end",
            marginTop: 3,
          }}
        />
      </Box>
    </CustomDialog>
  );
};

export default ManageCategoriesDialog;
