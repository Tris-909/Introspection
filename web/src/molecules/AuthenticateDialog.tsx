import React from "react";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";

interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

const AuthenticateDialog = (props: SimpleDialogProps) => {
  const { onClose, open, title } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button onClick={() => onClose()} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthenticateDialog;
