import React, { useRef, useState } from "react";
import { auth } from "../firebase.js";
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

export const SignInScreen = ({ setShowSignUpScreen }) => {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("SignInScreen rendered");

  const signIn = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!emailRef.current?.value) {
      setError("Email is required");
      return;
    }
    if (!passwordRef.current?.value) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    console.log("Attempting to sign in with:", emailRef.current.value);
    
    try {
      const result = await auth.signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log("Sign in successful:", result.user.email);
    } catch (err) {
      console.error("Sign in error:", err.message);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    console.log("Sign Up Now clicked");
    if (typeof setShowSignUpScreen === 'function') {
      console.log("Switching to sign up screen");
      setShowSignUpScreen(true);
    } else {
      console.error("setShowSignUpScreen is not a function");
    }
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
            <SpanLink onClick={handleSignUpClick}>
              Sign Up Now.
            </SpanLink>
          </SignUpDescription>
        </Form>
      </InnerContainer>
    </Container>
  );
};