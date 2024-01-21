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
  const user = useAppStore((state) => state.user);
  const isOpenManageCategoriesDialog = useAppStore(
    (state) => state.isOpenManageCategoriesDialog
  );
  const updateIsOpenManageCategoriesDialog = useAppStore(
    (state) => state.updateIsOpenManageCategoriesDialog
  );
  const [tags, setTags] = useState<string[]>([]);
  const [updateTag, setUpdateTag] = useState<string>("");
  const [isEdit, setIsEdit] = useState<string>("");

  useEffect(() => {
    if (user) {
      const tagsWithoutDefault = user.tags.filter(
        (tag: string) => tag !== "default"
      );
      setTags(tagsWithoutDefault);
    }
  }, [user]);

  const editTagHandler = async () => {
    const updateIndex = tags.findIndex((tag) => tag === isEdit);
    const copyTags = tags;
    copyTags[updateIndex] = updateTag;

    // Update tags list on user
    await updateDocument({
      collectionName: CollectionNames.USERS,
      id: user?.id,
      updatedData: {
        tags: copyTags,
      },
    });

    // Update all `Mistake` with this tag
    await updateRelatedMistakes(isEdit, updateTag);

    // Update tag list in app state
    setTags(copyTags);
    setIsEdit("");

    // Notify customer
    sendCustomNotification({
      message: "Update category successfully along with all related Mistakes",
      type: ToastTypes.success,
    });
  };

  const updateRelatedMistakes = async (oldTag: string, newTag: string) => {
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
      const currentTagListOfMistake = items[i].tags;
      const updateIndex = currentTagListOfMistake.findIndex(
        (tag: string) => tag === oldTag
      );
      currentTagListOfMistake[updateIndex] = newTag;

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
        {tags.length > 0 &&
          tags.map((tag: string, index: number) => {
            if (tag) {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setIsEdit(tag);
                          setUpdateTag(tag);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <ClearIcon />
                      </IconButton>
                    </>
                  }
                >
                  {isEdit === tag ? (
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
                    <ListItemText primary={tag} />
                  )}
                </ListItem>
              );
            }
            return null;
          })}
        <PrimaryButton
          title="Add new category"
          clickHandler={() => {
            console.log("Add new category");
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
