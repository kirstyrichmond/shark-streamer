import React, { useState } from "react";
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
import { SignUpScreen } from "./SignUpScreen";

export const LoginScreen = () => {
  const [signIn, setSignIn] = useState(false);
  const emailRef = useRef("");

  return (
    <Container>
      <BodyContainer>
        {signIn ? (
          <SignUpScreen emailRef={emailRef} />
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
                <GetStartedButton onClick={() => setSignIn(true)}>
                  Get Started
                </GetStartedButton>
              </Form>
            </InputContainer>
          </>
        )}
      </BodyContainer>
      <Gradient className="loginScreen_gradient" />
    </Container>
  );
};
