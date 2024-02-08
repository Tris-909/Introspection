import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Pagination,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Skeleton,
} from "@mui/material";
import {
  getDocumentById,
  CollectionNames,
  getDocumentsByPagination,
  deleteDocument,
  updateDocument,
} from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import {
  GreetingDialog,
  ConfirmDeleteDialog,
  UpdateMistakeDialog,
  RepetitionDialog,
} from "molecules";
import { PrimaryButton } from "atoms";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { sharedColor } from "consts";
import { Mistake, Condition, User } from "types";
import { sendCustomNotification, ToastTypes } from "utils";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "../App.css";

const Home = () => {
  // Global Context
  const { authUserInfo } = useAuthenticationStore();
  const {
    user,
    updateUser,
    mistakes,
    updateMistakes,
    updateIsOpenUpdateMistakeDialog,
    updateEditMistakeId,
    updateIsOpenAddRepetitionDialog,
    updateIsEditRepetition,
    updateEditRepetitionId,
  } = useAppStore();

  // Component Context
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDelete] = useState(false);
  const [deleteMistakeId, setDeleteMistakeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectivePage, setSelectivePage] = useState(1);
  const [nextCursor, setNextCursor] = useState<DocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [activeTag, setActiveTag] = useState<string>("Default");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Styles
  const isSmaller900px = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const getUserInfo = async () => {
      const uid = authUserInfo?.uid;

      if (uid) {
        const user = (await getDocumentById({
          collectionName: CollectionNames.USERS,
          id: uid,
        })) as User;

        if (user) {
          updateUser(user);
        } else {
          setOpen(true);
        }
      }
    };

    getUserInfo();
  }, [authUserInfo, updateUser]);

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
    if (user) {
      queryMistakesByTags();
    }
  }, [activeTag]);

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

  const onChangePage = async (newPage: number) => {
    const numberOfPagesHaveFetched = mistakes.length / 3;
    setSelectivePage(newPage);
    if (newPage > numberOfPagesHaveFetched) {
      queryMistakesByTags();
    }
  };

  const removeMistake = async (id: string) => {
    setConfirmDelete(true);
    setDeleteMistakeId(id);
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

  const confirmDeleteHandler = async () => {
    if (deleteMistakeId) {
      deleteMistakeHandler();
    }
  };

  const onChangeActiveTag = (category: string) => {
    setActiveTag(category);
    setNextCursor(null);
    updateMistakes([]);
  };

  return (
    <div className={open ? "blurred-background" : ""}>
      <Box
        p={2}
        display={"flex"}
        flexDirection={isSmaller900px ? "column" : "row"}
      >
        <Box width={isSmaller900px ? "100%" : "40%"}>
          <Typography variant="h3" fontFamily={"Josefin Slab"} fontWeight={600}>
            {dayjs().format("DD/MM/YYYY")}
          </Typography>
          <Typography
            variant="h4"
            fontFamily={"Josefin Slab"}
            fontWeight={600}
            mb={2}
          >
            Hi {user?.name}, Welcome back, ready to own your mistakes ?
          </Typography>
          {user &&
            user.categories.map((category: string) => {
              const isActive = activeTag === category;
              return (
                <Button
                  key={category}
                  variant={isActive ? "contained" : "outlined"}
                  sx={{
                    mr: 1,
                    color: isActive ? "white" : "gray",
                    borderColor: isActive ? "black" : "gray",
                    backgroundColor: isActive ? "black" : "white",
                    "&:hover": {
                      color: isActive ? "white" : "gray",
                      borderColor: isActive ? "black" : "gray",
                      backgroundColor: isActive ? "black" : "white",
                    },
                  }}
                  onClick={() => onChangeActiveTag(category)}
                >
                  {category}
                </Button>
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
              <>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={"100%"}
                  height={100}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={"100%"}
                  height={100}
                  sx={{
                    marginTop: 3,
                  }}
                />
              </>
            ) : (
              <>
                {mistakes
                  .slice(selectivePage * 3 - 3, selectivePage * 3)
                  .map((mistake: Mistake) => {
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
                        <AccordionDetails
                          sx={{ maxHeight: 200, overflow: "auto" }}
                        >
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
                                      deleteRepetitionHandler(
                                        mistake.id,
                                        repetition.id
                                      );
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
                                secondary={dayjs(repetition.createdAt).format(
                                  "DD/MM/YYYY"
                                )}
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
                  })}
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
        </Box>
        <Box width={isSmaller900px ? "100%" : "60%"} height={400}></Box>
        <GreetingDialog open={open} setOpen={setOpen} />
        <ConfirmDeleteDialog
          open={confirmDeleteOpen}
          setOpen={setConfirmDelete}
          deleteHandler={() => {
            confirmDeleteHandler();
          }}
        />
        <UpdateMistakeDialog />
        <RepetitionDialog />
      </Box>
    </div>
  );
};

export default Home;
