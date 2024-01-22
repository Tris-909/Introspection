import React from "react";
import { FormControl, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { PrimaryButton } from "atoms";
import { TextFieldPassword } from "molecules";
import { sendCustomNotification, ToastTypes } from "utils";
import { FormStates } from "templates/AuthenticationTemplate";
import { useAuthenticationStore } from "contexts";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "databases/firebase";
import { useNavigate } from "react-router-dom";

const AuthenticationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password need to have at least 6 characters")
    .required("Password is required"),
});

const AuthenticationForm = ({ formState }: { formState: FormStates }) => {
  const { updateDialogMessage, updateShowDialog, updateAutUserhInfo } =
    useAuthenticationStore();
  const navigate = useNavigate();

  const signUpHandler = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser!);
      updateDialogMessage("Please verify your email before login");
      updateShowDialog(true);
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  };

  const signInHandler = async (email: string, password: string) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { emailVerified } = userCredentials.user;

      if (!emailVerified) {
        signOut(auth);
        throw {
          code: "email_not_verified",
          message: "Please verify your email before login",
        };
      }

      updateAutUserhInfo(userCredentials.user);
      navigate("/");
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthenticationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (formState === FormStates.SignUp) {
          await signUpHandler(values.email, values.password);
        } else if (formState === FormStates.SignIn) {
          await signInHandler(values.email, values.password);
        }
      } catch (error: any) {
        if (error?.code.includes("email-already-in-use")) {
          setErrors({
            password: "Email has already been taken",
          });
        } else if (error?.code.includes("invalid-credential")) {
          setErrors({
            password: "Email or password is invalid, please try again",
          });
        } else if (error?.code.includes("email_not_verified")) {
          setErrors({
            password: error.message,
          });
        } else {
          sendCustomNotification({
            message: "Something is wrong, please try again later",
            type: ToastTypes.error,
          });
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl sx={{ width: "100%" }}>
        <TextField
          variant="outlined"
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.errors.email}
          error={
            (formik.touched.password && Boolean(formik.errors.password)) ||
            Boolean(formik.errors.email)
          }
        />
      </FormControl>
      <TextFieldPassword formik={formik} />

      <PrimaryButton
        title="Submit"
        style={{ mt: 2, width: "100%" }}
        clickHandler={() => {}}
      />
    </form>
  );
};

export default AuthenticationForm;
