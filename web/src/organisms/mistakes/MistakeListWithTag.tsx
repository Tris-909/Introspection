import React, { useState, useEffect } from "react";
import { Paper, Pagination } from "@mui/material";
import MistakeItemAccordion from "./MistakeItemAccordion";
import MistakeSkeleton from "./MistakeSkeleton";
import { Mistake, Condition } from "types";
import { useAppStore } from "contexts";
import {
  CollectionNames,
  getDocumentsByPagination,
  deleteDocument,
} from "databases/firestore";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { CategoryButton } from "atoms";
import { ConfirmDeleteDialog } from "molecules";
import { sendCustomNotification, ToastTypes } from "utils";

const MistakeList = () => {
  const { user, mistakes, updateMistakes } = useAppStore();

  const [page, setPage] = useState(1);
  const [selectivePage, setSelectivePage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<DocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [activeTag, setActiveTag] = useState<string>("Default");
  const [confirmDeleteOpen, setConfirmDelete] = useState(false);
  const [deleteMistakeId, setDeleteMistakeId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      queryMistakesByTags();
    }
  }, [user]);

  useEffect(() => {
    // Altering page number dynamically based on current fetched mistakes
    const numberOfPages = Math.ceil(mistakes.length / 3);
    if (numberOfPages !== page) {
      setSelectivePage(numberOfPages);
    }
    setPage(numberOfPages);
  }, [mistakes]);

  useEffect(() => {
    // Altering page number dynamically based on current fetched mistakes
    const numberOfPages = Math.ceil(mistakes.length / 3);
    if (numberOfPages !== page) {
      setSelectivePage(numberOfPages);
    }
    setPage(numberOfPages);
  }, [mistakes]);

  useEffect(() => {
    if (user) {
      queryMistakesByTags();
    }
  }, [activeTag]);

  const onChangePage = async (newPage: number) => {
    const numberOfPagesHaveFetched = mistakes.length / 3;
    setSelectivePage(newPage);
    if (newPage > numberOfPagesHaveFetched) {
      queryMistakesByTags();
    }
  };

  const queryMistakesByTags = async () => {
    setIsLoading(true);
    const queryConditions: Condition[] = [
      {
        field: "userId",
        operator: "==",
        value: user!.id,
      },
      {
        field: "category",
        operator: "==",
        value: activeTag,
      },
    ];
    const orderByField = "createdAt";

    try {
      const { items, cursor } = await getDocumentsByPagination({
        collectionName: CollectionNames.ERRRORS,
        conditions: queryConditions,
        orderByField: orderByField,
        lastVisibleDocument: nextCursor,
      });
      console.log("items", items);
      const newMistakesArr = [...mistakes, ...(items as Mistake[])];
      updateMistakes(newMistakesArr);
      setNextCursor(cursor);
      let numberOfPages = Math.ceil(newMistakesArr.length / 3);

      if (cursor) {
        const { items: nextItems } = await getDocumentsByPagination({
          collectionName: CollectionNames.ERRRORS,
          conditions: queryConditions,
          orderByField: orderByField,
          lastVisibleDocument: cursor,
        });
        console.log("cursor items", items);
        const newMistakesArr = [...mistakes, ...items, ...nextItems];
        numberOfPages = Math.ceil(newMistakesArr.length / 3);
      }
      setPage(numberOfPages);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const onChangeActiveTag = (category: string) => {
    setActiveTag(category);
    setNextCursor(null);
    updateMistakes([]);
  };

  const confirmDeleteHandler = async () => {
    if (deleteMistakeId) {
      deleteMistakeHandler();
    }
  };

  const deleteMistakeHandler = async () => {
    // Delete document in Firestore
    await deleteDocument({
      collectionName: CollectionNames.ERRRORS,
      id: deleteMistakeId as string,
    });

    // Remove the mistake from local state
    const newMistakesAfterDeletion = mistakes.filter(
      (mistake) => mistake.id !== deleteMistakeId
    );
    updateMistakes(newMistakesAfterDeletion);

    // Close confirm delete dialog
    setConfirmDelete(false);

    // Notify customer
    sendCustomNotification({
      message: "Delete mistake successfully",
      type: ToastTypes.success,
    });

    // Reset state
    setDeleteMistakeId(null);
  };

  return (
    <>
      {user?.categories.map((category: string) => {
        const isActive = activeTag === category;
        return (
          <CategoryButton
            key={category}
            category={category}
            isActive={isActive}
            clickHandler={() => onChangeActiveTag(category)}
            disabled={isLoading}
          />
        );
      })}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          mt: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <MistakeSkeleton />
        ) : (
          <>
            {mistakes
              .slice(selectivePage * 3 - 3, selectivePage * 3)
              .map((mistake: Mistake) => (
                <MistakeItemAccordion
                  mistake={mistake}
                  setConfirmDelete={setConfirmDelete}
                  setDeleteMistakeId={setDeleteMistakeId}
                />
              ))}
            {mistakes.length > 0 && (
              <Pagination
                count={page}
                page={selectivePage}
                onChange={async (e, value) => {
                  onChangePage(value);
                }}
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
          </>
        )}
      </Paper>
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        setOpen={setConfirmDelete}
        deleteHandler={() => {
          confirmDeleteHandler();
        }}
      />
    </>
  );
};

export default MistakeList;
