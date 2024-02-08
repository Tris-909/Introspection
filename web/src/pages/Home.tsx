import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { getDocumentById, CollectionNames } from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import {
  GreetingDialog,
  UpdateMistakeDialog,
  RepetitionDialog,
} from "molecules";
import { MistakeListWithTag } from "organisms";
import { User } from "types";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../App.css";

const Home = () => {
  const { authUserInfo } = useAuthenticationStore();
  const { user, updateUser } = useAppStore();

  const [open, setOpen] = useState(false);

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
          <MistakeListWithTag />
        </Box>
        <Box width={isSmaller900px ? "100%" : "60%"} height={400}></Box>
        <GreetingDialog open={open} setOpen={setOpen} />
        <UpdateMistakeDialog />
        <RepetitionDialog />
      </Box>
    </div>
  );
};

export default Home;
