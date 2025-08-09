import React, { useState } from "react";
import { Field } from "formik";
import {
  PasswordInputWrapper,
  PasswordInput,
  PasswordToggleButton,
  EyeIcon,
  EyeSlashIcon,
} from "../styles/SignUpScreen.styles";

export const PasswordField = ({ name, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PasswordInputWrapper>
      <Field
        as={PasswordInput}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <PasswordToggleButton
        type="button"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
      </PasswordToggleButton>
    </PasswordInputWrapper>
  );
};