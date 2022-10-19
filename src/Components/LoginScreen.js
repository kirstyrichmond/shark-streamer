import React from "react";
import { useRef } from "react";
import {
  BodyContainer,
  Container,
  DescOne,
  DescTwo,
  Form,
  GetStartedButton,
  Gradient,
  Input,
  InputContainer,
  Title,
} from "../styles/LoginScreen.styles";
import { SignInScreen } from "./SignInScreen";
import { SignUpScreen } from "./SignUpScreen";

export const LoginScreen = ({
  showSignInScreen,
  showSignUpScreen,
  setShowSignUpScreen,
}) => {
  const emailRef = useRef("");

  return (
    <>
      <Container>
        <BodyContainer>
          {showSignUpScreen ? (
            <SignUpScreen emailRef={emailRef} />
          ) : showSignInScreen ? (
            <SignInScreen setShowSignUpScreen={setShowSignUpScreen} />
          ) : (
            <>
              <Title>Unlimited films, TV programmes and more.</Title>
              <DescOne>Watch anywhere. Cancel at any time.</DescOne>
              <DescTwo>
                Ready to watch? Enter your email to create or restart your
                membership.
              </DescTwo>
              <InputContainer>
                <Form>
                  <Input
                    ref={emailRef}
                    type="email"
                    placeholder="Email address"
                  />
                  <GetStartedButton onClick={() => setShowSignUpScreen(true)}>
                    Get Started
                  </GetStartedButton>
                </Form>
              </InputContainer>
            </>
          )}
          {/* <Gradient className="loginScreen_gradient" /> */}
        </BodyContainer>
      </Container>
    </>
  );
};
