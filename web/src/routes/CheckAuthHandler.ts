import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "databases/firebase";
import { useAuthenticationStore } from "contexts";

const CheckAuthHandler = ({ children }: { children: any }) => {
  const updateAutUserhInfo = useAuthenticationStore(
    (state) => state.updateAutUserhInfo
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkCurrentUserAuth = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          updateAutUserhInfo(user);
          navigate("/");
        } else {
          navigate("/authenticate");
        }
      });
    };

    checkCurrentUserAuth();
  }, [navigate, updateAutUserhInfo]);

  return children;
};

export default CheckAuthHandler;
