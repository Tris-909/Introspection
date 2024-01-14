import React, { useState, useEffect } from "react";
import { Typography, Box, Paper } from "@mui/material";
import {
  getDocuments,
  getDocumentById,
  CollectionNames,
} from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import { GreetingDialog } from "molecules";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";

const Home = () => {
  const [open, setOpen] = useState(false);
  const authUserInfo = useAuthenticationStore((state) => state.authUserInfo);
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const isSmaller900px = useMediaQuery("(max-width: 900px)");

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
      console.log("did run");
      const mistakes = await getDocuments({
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
        lastVisibleDocument: null,
      });

      console.log("mistakes", mistakes);
    } catch (error) {
      console.log("error", error);
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
          elevation={3}
          sx={{ width: "100%", height: "500px", mt: 3 }}
        ></Paper>
      </Box>
      <Box width={isSmaller900px ? "100%" : "50%"} height={400}></Box>
      <GreetingDialog open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Home;
