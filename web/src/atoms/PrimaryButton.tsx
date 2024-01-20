import React from "react";
import { Button } from "@mui/material";
import { sharedColor } from "consts";

interface PrimaryButtonProps {
  title: string;
  clickHandler: () => void;
  style?: Record<string, unknown>;
}

const PrimaryButton = ({ title, clickHandler, style }: PrimaryButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={{
        color: sharedColor.button.primary,
        borderColor: sharedColor.button.primary,
        "&:hover": {
          color: sharedColor.button.primary,
          borderColor: sharedColor.button.primary,
          backgroundColor: sharedColor.button.bgColor,
        },
        ...style,
      }}
      type="submit"
      onClick={() => clickHandler()}
    >
      {title}
    </Button>
  );
};

export default PrimaryButton;
