import React, { useRef } from "react";
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

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(
        emailRef?.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log({ authUser });
      })
      .catch(() => alert("That user does not exist. Please try again."));
  };

  return (
    <Container>
      <InnerContainer>
        <Form>
          <Title>Sign In</Title>
          <Input
            ref={emailRef}
            defaultValue={emailRef?.current?.value}
            type="email"
            placeholder="Email"
            autoFocus
          />
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            autoFocus={!!emailRef?.current?.value}
          />
          <SignUpButton onClick={signIn}>Sign In</SignUpButton>
          <SignUpDescription>
            <DescriptionSpan>New to Netflix?</DescriptionSpan>{" "}
            <SpanLink onClick={() => setShowSignUpScreen(true)}>
              Sign Up Now.
            </SpanLink>
          </SignUpDescription>
        </Form>
      </InnerContainer>
    </Container>
  );
};
