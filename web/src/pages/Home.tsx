import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { getDocumentById, CollectionNames } from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import { GreetingDialog } from "molecules";
import dayjs from "dayjs";

const Home = () => {
  const [open, setOpen] = useState(false);
  const authUserInfo = useAuthenticationStore((state) => state.authUserInfo);
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);

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

  return (
    <Box p={2}>
      <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
        {dayjs().format("DD/MM/YYYY")}
      </Typography>
      <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
        Hi {user?.name}, Welcome back, ready to own your mistakes ?
      </Typography>
      <GreetingDialog open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Home;
