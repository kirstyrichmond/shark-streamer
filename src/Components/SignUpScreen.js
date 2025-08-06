import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/userSlice.js";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const resultAction = await dispatch(registerUser({ 
        email, 
        password: passwordRef.current.value 
      }));
      
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/add-profile");
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