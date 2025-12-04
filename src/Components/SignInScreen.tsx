import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { loginSchema } from "../schemas";
import { loginUser, showSignUp } from "../store/slices/userSlice";
import { PasswordField } from "./PasswordField";
import {
  Container,
  DescriptionSpan,
  Form,
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

export const SignInScreen = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  interface SignInValues {
    email: string;
    password: string;
  }

  const handleSubmit = async (values: SignInValues) => {
    setLoading(true);
    setError("");

    try {
      const resultAction = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        navigate(RoutePaths.Home);
      } else {
        setError(
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "Your email or password is incorrect. Please try again."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    dispatch(showSignUp());
  };

  return (
    <Container>
      <InnerContainer>
        <Formik initialValues={ initialValues } validationSchema={ loginSchema } onSubmit={ handleSubmit }>
          { () => (
            <Form as={ FormikForm }>
              <Title>Sign In</Title>
              { error && <p style={ { color: "#FF3131", marginBottom: "20px" } }>{ error }</p> }
              <Field as={ Input } name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component={ ErrorText } />
              <PasswordField name="password" placeholder="Password" />
              <ErrorMessage name="password" component={ ErrorText } />
              <SignUpButton type="submit" disabled={ loading }>
                { loading ? "Signing In..." : "Sign In" }
              </SignUpButton>
              <SignUpDescription>
                <DescriptionSpan>New to Shark Streamer?</DescriptionSpan>{ " " }
                <SpanLink onClick={ handleSignUpClick }>Sign Up Now.</SpanLink>
              </SignUpDescription>
            </Form>
          ) }
        </Formik>
      </InnerContainer>
    </Container>
  );
};
