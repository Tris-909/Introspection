import React from "react";
import { Button } from "@mui/material";
import { sharedColor } from "consts";

interface PrimaryButtonProps {
  title: string;
  clickHandler: () => void;
  style?: Record<string, unknown>;
  disabled?: boolean;
}

const PrimaryButton = ({
  title,
  clickHandler,
  style,
  disabled = false,
}: PrimaryButtonProps) => {
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
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default PrimaryButton;
