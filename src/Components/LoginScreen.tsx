import React, { useRef } from "react";
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
} from "../styles/LoginScreen.styles";
import { SignInScreen } from "./SignInScreen";
import { SignUpScreen } from "./SignUpScreen";

export const LoginScreen = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const uiState = useSelector(
    (state: { user: { interface: { showSignUp?: boolean; showSignIn?: boolean } } }) => state.user?.interface
  );
  const dispatch = useDispatch();

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(showSignUp());
  };

  if (uiState?.showSignUp) {
    return <SignUpScreen emailRef={ emailRef } />;
  }

  if (uiState?.showSignIn) {
    return <SignInScreen />;
  }

  return (
    <Container>
      <BodyContainer>
        <Title>Unlimited films, TV programmes and more.</Title>
        <DescOne>Watch anywhere. Cancel at any time.</DescOne>
        <DescTwo>Ready to watch? Enter your email to create or restart your membership.</DescTwo>
        <InputContainer>
          <Input ref={ emailRef } type="email" placeholder="Email address" />
          <GetStartedButton onClick={ handleGetStarted } type="button">
            Get Started
          </GetStartedButton>
        </InputContainer>
      </BodyContainer>
    </Container>
  );
};
