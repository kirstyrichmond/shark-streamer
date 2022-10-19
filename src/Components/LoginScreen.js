import React, { useState } from "react";
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

  return (
    <Container>
      <BodyContainer>
        {signIn ? (
          <SignUpScreen />
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
                <Input type="email" placeholder="Email address" />
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
