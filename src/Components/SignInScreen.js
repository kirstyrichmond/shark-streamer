import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { loginSchema } from "../schemas";
import { loginUser, showSignUp } from "../features/userSlice.js";
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
} from "../styles/SignUpScreen.styles.js";
import { RoutePaths } from "../router/types.js";

export const SignInScreen = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: ""
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");
    
    try {
      const resultAction = await dispatch(loginUser({
        email: values.email,
        password: values.password
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        navigate(RoutePaths.Home);
      } else {
        setError(resultAction.payload || 'Login failed');
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    dispatch(showSignUp());
  };

  return (
    <Container>
      <InnerContainer>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form as={FormikForm}>
              <Title>Sign In</Title>
              {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
              <Field
                as={Input}
                name="email"
                type="email"
                placeholder="Email"
              />
              <ErrorMessage name="email" component="div" style={{ color: "red", fontSize: "14px", marginTop: "5px" }} />
              <PasswordField
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="div" style={{ color: "red", fontSize: "14px", marginTop: "5px" }} />
              <SignUpButton type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </SignUpButton>
              <SignUpDescription>
                <DescriptionSpan>New to Netflix?</DescriptionSpan>{" "}
                <SpanLink onClick={handleSignUpClick}>
                  Sign Up Now.
                </SpanLink>
              </SignUpDescription>
            </Form>
          )}
        </Formik>
      </InnerContainer>
    </Container>
  );
};