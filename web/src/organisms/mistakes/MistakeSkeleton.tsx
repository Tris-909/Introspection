import React from "react";
import { Skeleton } from "@mui/material";

const MistakeSkeleton = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        height={100}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        height={100}
        sx={{
          marginTop: 3,
        }}
      />
    </>
  );
};

export default MistakeSkeleton;
