import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import {
  Container,
  InnerContainer,
  Form,
  Input,
  SignUpButton,
  Title,
} from "../styles/SignUpScreen.styles.js";

export const SignUpScreen = ({ emailRef: propsEmailRef }) => {
  const passwordRef = useRef(null);
  const [email, setEmail] = useState(propsEmailRef?.current?.value || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  // Listen for auth state changes within the component
  useEffect(() => {
    const authListener = auth.onAuthStateChanged((user) => {
      if (user && registered) {
        console.log("User authenticated in SignUpScreen, redirecting to home");
        // Force navigation to home page
        navigate("/");
      }
    });

    return () => {
      // Clean up the listener
      authListener();
    };
  }, [registered, navigate]);

  const register = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!passwordRef.current?.value) {
      setError("Password is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      console.log("Attempting to register with:", email);
      
      // Wait for the registration to complete
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        passwordRef.current.value
      );
      
      console.log("Registration successful:", userCredential.user.email);
      
      // Set registered flag to trigger navigation in useEffect
      setRegistered(true);
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <InnerContainer>
        <Form onSubmit={register}>
          <Title>Sign Up</Title>
          
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Signing Up..." : "Sign Up"}
          </SignUpButton>
        </Form>
      </InnerContainer>
    </Container>
  );
};