import React from "react";
import { useRef } from "react";
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
  showSignInScreen,
  showSignUpScreen,
  setShowSignUpScreen,
}) => {
  const emailRef = useRef("");

  return (
    <>
      <Container>
        {showSignUpScreen ? (
          <SignUpScreen emailRef={emailRef} />
        ) : showSignInScreen ? (
          <SignInScreen setShowSignUpScreen={setShowSignUpScreen} />
        ) : (
          <>
            <BodyContainer>
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
            </BodyContainer>
          </>
        )}
        {/* <Gradient className="loginScreen_gradient" /> */}
      </Container>
    </>
  );
};
