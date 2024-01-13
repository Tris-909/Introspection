import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { auth, db } from "databases/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthenticationStore } from "contexts";

const Home = () => {
  const autUserhInfo = useAuthenticationStore((state) => state.autUserhInfo);

  useEffect(() => {
    const getUserInfo = async () => {
      const uid = autUserhInfo?.uid;

      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    };

    getUserInfo();
  }, [autUserhInfo]);

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
