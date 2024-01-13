import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { auth } from "databases/firebase";
import { signOut } from "firebase/auth";
import {
  getDocumentById,
  CollectionNames,
  createDocument,
} from "databases/firestore";
import { useAuthenticationStore, useAppStore } from "contexts";
import dayjs from "dayjs";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameInputError, setNameInputError] = useState(false);
  const autUserhInfo = useAuthenticationStore((state) => state.autUserhInfo);
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);

  useEffect(() => {
    const getUserInfo = async () => {
      const uid = autUserhInfo?.uid;

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
  }, [autUserhInfo]);

  const createUserEntity = async () => {
    await createDocument({
      collectionName: CollectionNames.USERS,
      data: {
        id: autUserhInfo?.uid,
        name: nameInput,
        createdAt: Date.now(),
      },
    });
  };

  return (
    <div>
      <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
        {dayjs().format("DD/MM/YYYY")}
      </Typography>
      <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
        Hi {user?.name}, Welcome back, ready to own your mistakes ?
      </Typography>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hola, welcome to
          <Typography
            fontFamily={"Josefin Slab"}
            fontWeight={600}
            fontSize={20}
            style={{ display: "inline-block" }}
            ml={1}
            mr={1}
          >
            Introspection
          </Typography>
          for the first time !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="black">
            This software allows you to record your mistake and reflect on it.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" color="black" mt={1}>
            We will not only remember your mistakes but also the actions that
            you take to fix them.
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            color="black"
            mt={1}
            mb={2}
          >
            Let get you started, first please tell us your first name.
          </DialogContentText>
          <TextField
            id="standard-basic"
            label="Your Name"
            variant="standard"
            value={nameInput}
            error={nameInputError}
            helperText={
              nameInputError && "Name can only have up to 10 characters"
            }
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                setNameInputError(false);
                setNameInput(e.target.value);
              } else {
                setNameInputError(true);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              createUserEntity();
              setOpen(false);
            }}
            autoFocus
            variant="outlined"
            disabled={nameInput.length === 0}
          >
            Let's start
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="outlined"
        sx={{ mt: 2, width: "100%" }}
        type="submit"
        onClick={() => {
          signOut(auth);
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
