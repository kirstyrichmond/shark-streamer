import { useState } from "react";
import { useField } from "formik";
import {
  PasswordInputWrapper,
  PasswordInput,
  PasswordToggleButton,
  EyeIcon,
  EyeSlashIcon,
} from "../styles/SignUpScreen.styles";

interface PasswordFieldProps {
  name: string;
  placeholder: string;
}

export const PasswordField = ({ name, placeholder }: PasswordFieldProps) => {
  const [field] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordInputWrapper>
      <PasswordInput
        { ...field }
        type={ showPassword ? "text" : "password" }
        placeholder={ placeholder }
      />
      <PasswordToggleButton
        type="button"
        onClick={ () => setShowPassword(!showPassword) }
        aria-label={ showPassword ? "Hide password" : "Show password" }
      >
        { showPassword ? <EyeSlashIcon /> : <EyeIcon /> }
      </PasswordToggleButton>
    </PasswordInputWrapper>
  );
};
