import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { registerSchema } from "../schemas";
import { registerUser, showSignIn } from "../store/slices/userSlice";
import { PasswordField } from "./PasswordField";
import {
  Container,
  InnerContainer,
  Form,
  Input,
  SignUpButton,
  Title,
  SignUpDescription,
  DescriptionSpan,
  SpanLink,
  ErrorText,
} from "../styles/SignUpScreen.styles";
import { RoutePaths } from "../router/types";
import { useAppDispatch } from "../app/store";

interface SignUpScreenProps {
  emailRef?: React.RefObject<HTMLInputElement | null>;
}

export const SignUpScreen = ({ emailRef: propsEmailRef }: SignUpScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues = {
    email: propsEmailRef?.current?.value || "",
    password: "",
  };

  interface SignUpValues {
    email: string;
    password: string;
  }

  const handleSubmit = async (values: SignUpValues) => {
    setLoading(true);
    setError("");

    try {
      const resultAction = await dispatch(
        registerUser({
          email: values.email,
          password: values.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        navigate(RoutePaths.Profiles);
      } else {
        setError(typeof resultAction.payload === "string" ? resultAction.payload : "Registration failed");
      }
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(showSignIn());
  };

  return (
    <Container>
      <InnerContainer>
        <Formik initialValues={ initialValues } validationSchema={ registerSchema } onSubmit={ handleSubmit }>
          { () => (
            <Form as={ FormikForm }>
              <Title>Sign Up</Title>
              { error && <p style={ { color: "#FF3131", marginBottom: "10px" } }>{ error }</p> }
              <Field as={ Input } name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component={ ErrorText } />
              <PasswordField name="password" placeholder="Password" />
              <ErrorMessage name="password" component={ ErrorText } />
              <SignUpButton type="submit" disabled={ loading }>
                { loading ? "Signing Up..." : "Sign Up" }
              </SignUpButton>
              <SignUpDescription>
                <DescriptionSpan>Already have an account?</DescriptionSpan>{ " " }
                <SpanLink onClick={ handleSignInClick }>Sign In Now.</SpanLink>
              </SignUpDescription>
            </Form>
          ) }
        </Formik>
      </InnerContainer>
    </Container>
  );
};
