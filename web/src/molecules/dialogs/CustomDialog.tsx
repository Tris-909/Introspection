import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const CustomDialog = ({
  title,
  open,
  setOpen,
  children,
}: {
  title: string | React.ReactElement;
  open: boolean;
  setOpen: (new_value: boolean) => void;
  children: React.ReactElement;
}) => {
  return (
    <Dialog onClose={() => setOpen(false)} open={open} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
