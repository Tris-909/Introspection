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
} from "@mui/material";
import {
  getDocumentById,
  CollectionNames,
  getDocumentsByPagination,
  deleteDocument,
} from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import { GreetingDialog, ConfirmDeleteDialog } from "molecules";
import { PrimaryButton } from "atoms";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { sharedColor } from "consts";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDelete] = useState(false);
  const [deleteMistakeId, setDeleteMistakeId] = useState<string | null>(null);
  const authUserInfo = useAuthenticationStore((state) => state.authUserInfo);
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const isSmaller900px = useMediaQuery("(max-width: 900px)");
  const [mistakes, setMistakes] = useState<DocumentData[]>([]);
  const [page, setPage] = useState(1);
  const [selectivePage, setSelectivePage] = useState(1);
  const [nextCursor, setNextCursor] = useState<DocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const uid = authUserInfo?.uid;

      if (uid) {
        const user = await getDocumentById({
          collectionName: CollectionNames.USERS,
          id: uid,
        });

        if (user) {
          updateUser(user);
        } else {
          setOpen(true);
        }
      }
    };

    getUserInfo();
  }, [authUserInfo]);

  useEffect(() => {
    if (user) {
      queryMistakesByTags();
    }
  }, [user]);

  const queryMistakesByTags = async () => {
    try {
      const { items, cursor } = await getDocumentsByPagination({
        collectionName: CollectionNames.ERRRORS,
        conditions: [
          {
            field: "userId",
            operator: "==",
            value: user!.id,
          },
          {
            field: "tags",
            operator: "array-contains",
            value: "default",
          },
        ],
        orderByField: "createdAt",
        lastVisibleDocument: nextCursor,
      });

      const newMistakesArr = [...mistakes, ...items];
      setMistakes(newMistakesArr);
      setNextCursor(cursor);
      let numberOfPages = Math.ceil(newMistakesArr.length / 3);

      if (cursor) {
        const { items: nextItems } = await getDocumentsByPagination({
          collectionName: CollectionNames.ERRRORS,
          conditions: [
            {
              field: "userId",
              operator: "==",
              value: user!.id,
            },
            {
              field: "tags",
              operator: "array-contains",
              value: "default",
            },
          ],
          orderByField: "createdAt",
          lastVisibleDocument: cursor,
        });
        const newMistakesArr = [...mistakes, ...items, ...nextItems];
        numberOfPages = Math.ceil(newMistakesArr.length / 3);
      }
      setPage(numberOfPages);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onChangePage = async (newPage: number) => {
    const numberOfPagesHaveFetched = mistakes.length / 3;
    setSelectivePage(newPage);
    if (newPage > numberOfPagesHaveFetched) {
      queryMistakesByTags();
    }
  };

  const prepareMistakes = () => {
    const lastItemIndex = selectivePage * 3;
    const firstItemIndex = selectivePage * 3 - 3;

    return mistakes.slice(firstItemIndex, lastItemIndex);
  };

  const removeMistake = async (id: string) => {
    setConfirmDelete(true);
    setDeleteMistakeId(id);
  };

  const confirmDeleteHandler = async () => {
    if (deleteMistakeId) {
      // Delete document in Firestore
      await deleteDocument({
        collectionName: CollectionNames.ERRRORS,
        id: deleteMistakeId,
      });

      // Remove the mistake from local state
      const newMistakesAfterDeletion = mistakes.filter(
        (mistake) => mistake.id !== deleteMistakeId
      );
      setMistakes(newMistakesAfterDeletion);

      // Altering page number dynamically
      const numberOfPages = Math.ceil(newMistakesAfterDeletion.length / 3);
      if (numberOfPages !== page) {
        setSelectivePage(numberOfPages);
      }
      setPage(numberOfPages);

      // Close confirm delete dialog
      setConfirmDelete(false);
    }
  };

  return (
    <Box
      p={2}
      display={"flex"}
      flexDirection={isSmaller900px ? "column" : "row"}
    >
      <Box width={isSmaller900px ? "100%" : "50%"}>
        <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
          {dayjs().format("DD/MM/YYYY")}
        </Typography>
        <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
          Hi {user?.name}, Welcome back, ready to own your mistakes ?
        </Typography>
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
          {prepareMistakes().map((mistake) => {
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
                <AccordionDetails>
                  {mistake.repetitions.map((repetition: any, index: string) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" disabled>
                          <DeleteIcon />
                        </IconButton>
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
                    title="Delete Mistake"
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
        </Paper>
      </Box>
      <Box width={isSmaller900px ? "100%" : "50%"} height={400}></Box>
      <GreetingDialog open={open} setOpen={setOpen} />
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        setOpen={setConfirmDelete}
        deleteHandler={() => confirmDeleteHandler()}
      />
    </Box>
  );
};

export default Home;
