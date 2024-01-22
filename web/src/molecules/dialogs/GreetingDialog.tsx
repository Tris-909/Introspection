import React, { useState } from "react";
import { DialogContentText, TextField, Typography, Box } from "@mui/material";
import { useAuthenticationStore } from "contexts";
import { CollectionNames, createDocument } from "databases/firestore";
import CustomDialog from "./CustomDialog";
import { PrimaryButton } from "atoms";

const GreetingDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (newValue: boolean) => void;
}) => {
  const { authUserInfo } = useAuthenticationStore();
  const [nameInput, setNameInput] = useState("");
  const [nameInputError, setNameInputError] = useState(false);

  const createUserEntity = async () => {
    await createDocument({
      collectionName: CollectionNames.USERS,
      data: {
        id: authUserInfo?.uid,
        name: nameInput,
        createdAt: Date.now(),
      },
    });
  };

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={
        <>
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
        </>
      }
    >
      <Box display={"flex"} flexDirection={"column"}>
        <DialogContentText color="black">
          This software allows you to record your mistake and reflect on it.
        </DialogContentText>
        <DialogContentText color="black" mt={1}>
          We will not only remember your mistakes but also the actions that you
          take to fix them.
        </DialogContentText>
        <DialogContentText color="black" mt={1} mb={2}>
          Let get you started, first please tell us your first name.
        </DialogContentText>
        <TextField
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
        <PrimaryButton
          title="Let's Start"
          clickHandler={() => {
            createUserEntity();
            setOpen(false);
          }}
          style={{
            alignSelf: "flex-end",
            mt: 3,
          }}
        />
      </Box>
    </CustomDialog>
  );
};

export default GreetingDialog;
