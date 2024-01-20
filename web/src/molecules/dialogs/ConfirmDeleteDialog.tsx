import React, { useState } from "react";
import { DialogContentText, Typography, Box } from "@mui/material";
import CustomDialog from "./CustomDialog";
import { PrimaryButton } from "atoms";
import { sharedColor } from "consts";

const ConfirmDeleteDialog = ({
  open,
  setOpen,
  deleteHandler,
}: {
  open: boolean;
  setOpen: (newValue: boolean) => void;
  deleteHandler: () => void;
}) => {
  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={
        <Typography fontWeight={600} fontSize={20}>
          Confirm Delete
        </Typography>
      }
    >
      <Box display={"flex"} flexDirection={"column"}>
        <DialogContentText color="black">
          Are you sure you want to delete this mistake permanently ?
        </DialogContentText>
        <PrimaryButton
          title="Delete Permanently"
          clickHandler={() => deleteHandler()}
          style={{
            alignSelf: "flex-end",
            mt: 3,
            borderColor: sharedColor.button.alert,
            color: sharedColor.button.alert,
            "&:hover": {
              borderColor: sharedColor.button.alert,
              color: sharedColor.button.alert,
            },
          }}
        />
      </Box>
    </CustomDialog>
  );
};

export default ConfirmDeleteDialog;
