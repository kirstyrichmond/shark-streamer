import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showSignUp } from "../store/slices/userSlice";
import {
  BodyContainer,
  Container,
  DescOne,
  DescTwo,
  GetStartedButton,
  Input,
  InputContainer,
  Title,
  ErrorText,
} from "../styles/LoginScreen.styles";
import { AuthScreen } from "./AuthScreen";

export const LoginScreen = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const uiState = useSelector(
    (state: { user: { interface: { showSignUp?: boolean; showSignIn?: boolean } } }) => state.user?.interface
  );
  const dispatch = useDispatch();

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value || "";

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    dispatch(showSignUp());
  };

  if (uiState?.showSignUp) {
    return <AuthScreen mode="signup" emailRef={ emailRef } />;
  }

  if (uiState?.showSignIn) {
    return <AuthScreen mode="signin" />;
  }

  return (
    <Container>
      <BodyContainer>
        <Title>Unlimited films, TV programmes and more.</Title>
        <DescOne>Watch anywhere. Cancel at any time.</DescOne>
        <DescTwo>Ready to watch? Enter your email to create or restart your membership.</DescTwo>
        <InputContainer hasError={ !!error }>
          <Input
            ref={ emailRef }
            type="email"
            placeholder="Email address"
            onChange={ () => setError("") }
            hasError={ !!error }
          />
          <GetStartedButton onClick={ handleGetStarted } type="button">
            Get Started
          </GetStartedButton>
        </InputContainer>
        { error && <ErrorText>{ error }</ErrorText> }
      </BodyContainer>
    </Container>
  );
};
