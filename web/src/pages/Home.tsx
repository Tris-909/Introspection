import React from "react";
import { Button } from "@mui/material";
import { auth } from "databases/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      HomeScreen
      <Button
        variant="outlined"
        sx={{ mt: 2, width: "100%" }}
        type="submit"
        onClick={() => {
          signOut(auth);
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
