import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormikValues } from "formik";

/**
 * `TextFieldPassword` is used with `formik` specfically. Should be used when dealing with Password Input that allow user to hide/show their passwords.
 */
const TextFieldPassword = ({ formik }: { formik: FormikValues }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
      <InputLabel htmlFor="password">Password</InputLabel>
      <OutlinedInput
        id="password"
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {formik.touched.password && formik.errors.password && (
        <FormHelperText error>{formik.errors.password}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TextFieldPassword;
