import React from "react";
import { Box, Typography } from "@mui/material";
import DoorIcon from "@mui/icons-material/DoorFront";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight={"100vh"}
      minWidth={"100vw"}
      sx={{ backgroundColor: "black", color: "white" }}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography
        variant="h5"
        mb={1}
        textAlign={"center"}
        fontFamily={"Josefin Slab"}
        fontWeight={600}
      >
        Shhhh, Where are you wondering around in the darkness ?
      </Typography>
      <Typography variant="h5" fontFamily={"Josefin Slab"} fontWeight={600}>
        Come back through this door !
      </Typography>
      <DoorIcon
        style={{
          color: "white",
          width: "130px",
          height: "200px",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
        }}
      />
    </Box>
  );
};

export default NotFound;
