import React from "react";
import { Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

interface CategoryButtonProps {
  key: string;
  isActive: boolean;
  clickHandler: () => void;
  category: string;
  disabled?: boolean;
}

const CategoryButton = ({
  key,
  isActive,
  clickHandler,
  category,
  disabled = false,
}: CategoryButtonProps) => {
  const isSmaller900px = useMediaQuery("(max-width: 900px)");

  return (
    <Button
      key={key}
      variant={isActive ? "contained" : "outlined"}
      sx={{
        mr: 1,
        mt: isSmaller900px ? 2 : 0,
        color: isActive ? "white" : "gray",
        borderColor: isActive ? "black" : "gray",
        backgroundColor: isActive ? "black" : "white",
        "&:hover": {
          color: isActive ? "white" : "gray",
          borderColor: isActive ? "black" : "gray",
          backgroundColor: isActive ? "black" : "white",
        },
      }}
      onClick={() => clickHandler()}
      disabled={disabled}
    >
      {category}
    </Button>
  );
};

export default CategoryButton;
