import React from "react";
import { Link } from "@mui/material";
import { sharedColor } from "consts";

interface ActionLinkProps {
  title: string;
  clickHandler: () => void;
  style: Record<string, unknown>;
}

const ActionLink = ({ title, clickHandler, style }: ActionLinkProps) => {
  return (
    <Link
      color={sharedColor.link.primary}
      sx={{ cursor: "pointer", ...style }}
      onClick={() => clickHandler()}
    >
      {title}
    </Link>
  );
};

export default ActionLink;
