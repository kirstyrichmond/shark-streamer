import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { registerSchema } from "../schemas";
import { registerUser } from "../features/userSlice.js";
import { PasswordField } from "./PasswordField";
import {
  Container,
  InnerContainer,
  Form,
  Input,
  SignUpButton,
  Title,
} from "../styles/SignUpScreen.styles.js";

export const SignUpScreen = ({ emailRef: propsEmailRef }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: propsEmailRef?.current?.value || "",
    password: ""
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");
    
    try {
      const resultAction = await dispatch(registerUser({
        email: values.email,
        password: values.password
      }));
      
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/profiles");
      } else {
        setError(resultAction.payload || 'Registration failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <InnerContainer>
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form as={FormikForm}>
              <Title>Sign Up</Title>
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
                {loading ? "Signing Up..." : "Sign Up"}
              </SignUpButton>
            </Form>
          )}
        </Formik>
      </InnerContainer>
    </Container>
  );
};