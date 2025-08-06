import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, showSignUp } from "../features/userSlice.js";
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

export const SignInScreen = () => {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("SignInScreen rendered");

  const signIn = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!emailRef.current?.value) {
      setError("Email is required");
      return;
    }
    if (!passwordRef.current?.value) {
      setError("Password is required");
      return;
    }

    setLoading(true);    
    try {
      const resultAction = await dispatch(loginUser({ 
        email: emailRef.current.value, 
        password: passwordRef.current.value 
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      } else {
        setError(resultAction.payload || 'Login failed');
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    console.log("Sign Up Now clicked");
    dispatch(showSignUp());
  };

  return (
    <Container>
      <InnerContainer>
        <Form onSubmit={signIn}>
          <Title>Sign In</Title>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Input
            ref={emailRef}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
          />
          <SignUpButton type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </SignUpButton>
          <SignUpDescription>
            <DescriptionSpan>New to Netflix?</DescriptionSpan>{" "}
            <SpanLink onClick={handleSignInClick}>
              Sign Up Now.
            </SpanLink>
          </SignUpDescription>
        </Form>
      </InnerContainer>
    </Container>
  );
};