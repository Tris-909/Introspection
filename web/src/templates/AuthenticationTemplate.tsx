import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Paper, Typography } from "@mui/material";
import { ActionLink } from "atoms";
import { AuthenticateDialog } from "molecules";
import { useAuthenticationStore } from "contexts";
import { AuthenticationForm, ForgotPasswordForm } from "organisms";
import useMediaQuery from "@mui/material/useMediaQuery";

export enum FormStates {
  SignIn = "signin",
  SignUp = "signup",
  ResetPasswordEmail = "reset-password-email",
}

const AuthenticationTemplate = () => {
  const { dialogMessage, showDialog, updateShowDialog } =
    useAuthenticationStore();
  const [formState, setFormState] = useState<FormStates>(FormStates.SignIn);

  const isSmaller900px = useMediaQuery("(max-width: 900px)");
  const isSmaller600px = useMediaQuery("(max-width: 900px)");

  const createFormName = () => {
    switch (formState) {
      case FormStates.SignUp:
        return "Sign Up";
      case FormStates.SignIn:
        return "Sign In";
      case FormStates.ResetPasswordEmail:
        return "Reset Password";
      default:
        return "Sign In";
    }
  };

  const createFormLinks = () => {
    if (formState === FormStates.SignUp) {
      return "Already have an account ? Click here to sign in";
    }

    return "Don't have an account ? Click here to sign up";
  };

  return (
    <Grid container minHeight={"100vh"}>
      <Grid xs></Grid>
      <Grid
        xs={isSmaller600px ? 11 : isSmaller900px ? 8 : 4}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box minWidth={"100%"} minHeight={"60%"}>
          <Paper elevation={3}>
            <Box p={3}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={3}
              >
                <Typography variant="h3" mb={1} fontFamily={"Josefin Slab"}>
                  Introspection
                </Typography>
                <Typography variant="h4" mb={6} fontFamily={"Josefin Slab"}>
                  {createFormName()}
                </Typography>

                {[FormStates.SignIn, FormStates.SignUp].includes(formState) && (
                  <AuthenticationForm formState={formState} />
                )}

                {formState === FormStates.ResetPasswordEmail && (
                  <ForgotPasswordForm />
                )}

                <ActionLink
                  title={createFormLinks()}
                  clickHandler={() => {
                    formState === FormStates.SignIn
                      ? setFormState(FormStates.SignUp)
                      : setFormState(FormStates.SignIn);
                  }}
                  style={{ marginTop: 5 }}
                />

                {(formState === FormStates.SignIn ||
                  formState === FormStates.SignUp) && (
                  <ActionLink
                    title={"Forgot Password ?"}
                    clickHandler={() => {
                      setFormState(FormStates.ResetPasswordEmail);
                    }}
                    style={{ marginTop: 2 }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
      <Grid xs></Grid>
      <AuthenticateDialog
        open={showDialog}
        onClose={() => updateShowDialog(false)}
        title={dialogMessage}
      />
    </Grid>
  );
};

export default AuthenticationTemplate;
