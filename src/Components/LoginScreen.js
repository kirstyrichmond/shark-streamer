import React, { useState, useRef } from "react";
import {
  BodyContainer,
  Container,
  DescOne,
  DescTwo,
  Form,
  GetStartedButton,
  Input,
  InputContainer,
  Title,
} from "../styles/LoginScreen.styles";
import { SignInScreen } from "./SignInScreen";
import { SignUpScreen } from "./SignUpScreen";

export const LoginScreen = ({
  // We'll still accept these props but will manage state locally as well
  showSignInScreen: propShowSignIn,
  showSignUpScreen: propShowSignUp,
  setShowSignInScreen,
  setShowSignUpScreen
}) => {
  // Manage state locally so it works regardless of parent component behavior
  const [localShowSignIn, setLocalShowSignIn] = useState(false);
  const [localShowSignUp, setLocalShowSignUp] = useState(false);
  const emailRef = useRef(null);

  // Determine which state to use - prefer props if they're true, otherwise use local state
  const effectiveShowSignIn = propShowSignIn || localShowSignIn;
  const effectiveShowSignUp = propShowSignUp || localShowSignUp;

  console.log("LoginScreen state:", { 
    propSignIn: propShowSignIn, 
    propSignUp: propShowSignUp,
    localSignIn: localShowSignIn,
    localSignUp: localShowSignUp,
    effective: {
      signIn: effectiveShowSignIn,
      signUp: effectiveShowSignUp
    }
  });

  // Handle Get Started click
  const handleGetStarted = (e) => {
    e.preventDefault();
    console.log("Get Started clicked, email:", emailRef.current?.value);
    
    // Update both local and parent state if available
    setLocalShowSignUp(true);
    if (typeof setShowSignUpScreen === 'function') {
      setShowSignUpScreen(true);
    }
  };

  // Render based on effective state
  if (effectiveShowSignUp) {
    console.log("Rendering SignUpScreen component");
    return <SignUpScreen emailRef={emailRef} />;
  }

  if (effectiveShowSignIn) {
    console.log("Rendering SignInScreen component");
    const handleSignUpClick = () => {
      setLocalShowSignUp(true);
      setLocalShowSignIn(false);
      if (typeof setShowSignUpScreen === 'function') {
        setShowSignUpScreen(true);
      }
      if (typeof setShowSignInScreen === 'function') {
        setShowSignInScreen(false);
      }
    };
    return <SignInScreen setShowSignUpScreen={handleSignUpClick} />;
  }

  // Main login screen
  return (
    <Container>
      <BodyContainer>
        <Title>Unlimited films, TV programmes and more.</Title>
        <DescOne>Watch anywhere. Cancel at any time.</DescOne>
        <DescTwo>
          Ready to watch? Enter your email to create or restart your
          membership.
        </DescTwo>
        <InputContainer>
          <div>
            <Input
              ref={emailRef}
              type="email"
              placeholder="Email address"
            />
            <GetStartedButton 
              onClick={handleGetStarted}
              type="button"
            >
              Get Started
            </GetStartedButton>
          </div>
        </InputContainer>
      </BodyContainer>
    </Container>
  );
};