import React from "react";
import { FormControl, TextField } from "@mui/material";
import { PrimaryButton } from "atoms";
import { useAuthenticationStore } from "contexts";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "databases/firebase";
import { sendCustomNotification, ToastTypes } from "utils";

const ForgotPasswordForm = () => {
  const {
    confirmEmail,
    updateConfirmEmail,
    updateDialogMessage,
    updateShowDialog,
  } = useAuthenticationStore();

  const sendResetPasswordEmailhandler = async (confirmEmail: string) => {
    try {
      await sendPasswordResetEmail(auth, confirmEmail);
      updateDialogMessage(
        "Email to reset your password has been sent to your email"
      );
      updateShowDialog(true);
    } catch (error) {
      sendCustomNotification({
        message: "Something is wrong, please try again later",
        type: ToastTypes.error,
      });
    }
  };

  return (
    <form>
      <FormControl sx={{ width: "100%" }}>
        <TextField
          variant="outlined"
          id="confirm_email"
          name="confirm_email"
          label="Email"
          type="email"
          value={confirmEmail}
          onChange={(e) => updateConfirmEmail(e.target.value)}
        />
      </FormControl>

      <PrimaryButton
        title="Submit"
        style={{ mt: 2, width: "100%" }}
        clickHandler={() => {
          sendResetPasswordEmailhandler(confirmEmail);
        }}
      />
    </form>
  );
};

export default ForgotPasswordForm;
