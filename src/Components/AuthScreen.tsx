import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field } from "formik";
import { loginSchema, registerSchema } from "../schemas";
import { loginUser, registerUser, showSignUp, showSignIn } from "../store/slices/userSlice";
import { PasswordField } from "./PasswordField";
import {
  Container,
  DescriptionSpan,
  InnerContainer,
  Input,
  SignUpButton,
  SignUpDescription,
  SpanLink,
  Title,
  ErrorText,
} from "../styles/SignUpScreen.styles";
import { RoutePaths } from "../router/types";
import { useAppDispatch } from "../app/store";

interface AuthScreenProps {
  mode: "signin" | "signup";
  emailRef?: React.RefObject<HTMLInputElement | null>;
}

interface AuthValues {
  email: string;
  password: string;
}

export const AuthScreen = ({ mode, emailRef }: AuthScreenProps) => {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSignIn = mode === "signin";

  const initialValues: AuthValues = {
    email: emailRef?.current?.value || "",
    password: "",
  };

  const onSubmit = async (values: AuthValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError("");

    try {
      const resultAction = await dispatch(
        isSignIn
          ? loginUser({
              email: values.email,
              password: values.password,
            })
          : registerUser({
              email: values.email,
              password: values.password,
            })
      );

      if (isSignIn) {
        if (loginUser.fulfilled.match(resultAction)) {
          navigate(RoutePaths.Home);
        } else {
          setError(
            typeof resultAction.payload === "string"
              ? resultAction.payload
              : "Your email or password is incorrect. Please try again."
          );
        }
      } else {
        if (registerUser.fulfilled.match(resultAction)) {
          navigate(RoutePaths.Profiles);
        } else {
          setError(typeof resultAction.payload === "string" ? resultAction.payload : "Registration failed");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isSignIn ? "sign in" : "sign up"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMode = (e: React.MouseEvent<HTMLSpanElement | HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(isSignIn ? showSignUp() : showSignIn());
  };

  return (
    <Container>
      <InnerContainer>
        <Formik
          initialValues={ initialValues }
          validationSchema={ isSignIn ? loginSchema : registerSchema }
          onSubmit={ onSubmit }
          validateOnBlur={ true }
        >
          { ({ errors, touched, isSubmitting }) => (
            <FormikForm>
              <Title>{ isSignIn ? "Sign In" : "Sign Up" }</Title>
              { error && <p style={ { color: "#FF3131", marginBottom: isSignIn ? "20px" : "10px" } }>{ error }</p> }
              <Field as={ Input } name="email" type="email" placeholder="Email" />
              { errors.email && touched.email && <ErrorText>{ errors.email }</ErrorText> }
              <PasswordField name="password" placeholder="Password" />
              { errors.password && touched.password && <ErrorText>{ errors.password }</ErrorText> }
              <SignUpButton type="submit" disabled={ isSubmitting }>
                { isSubmitting ? (isSignIn ? "Signing In..." : "Signing Up...") : (isSignIn ? "Sign In" : "Sign Up") }
              </SignUpButton>
              <SignUpDescription>
                <DescriptionSpan>
                  { isSignIn ? "New to Shark Streamer?" : "Already have an account?" }
                </DescriptionSpan>{ " " }
                <SpanLink onClick={ handleToggleMode }>
                  { isSignIn ? "Sign Up Now." : "Sign In Now." }
                </SpanLink>
              </SignUpDescription>
            </FormikForm>
          ) }
        </Formik>
      </InnerContainer>
    </Container>
  );
};
