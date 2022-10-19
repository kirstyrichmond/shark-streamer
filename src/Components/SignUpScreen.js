import React, { useRef } from "react";
import { auth } from "../firebase.js";
import {
  Container,
  DescriptionSpan,
  Form,
  Input,
  SignUpButton,
  SignUpDescription,
  SpanLink,
  Title,
} from "../styles/SignUpScreen.styles.js";

export const SignUpScreen = ({ emailRef }) => {
  const passwordRef = useRef(null);

  const register = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log({ authUser });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log({ authUser });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Container>
      <Form>
        <Title>Sign In</Title>
        <Input
          ref={emailRef}
          defaultValue={emailRef.current.value}
          type="email"
          placeholder="Email"
          autoFocus={!emailRef.current.value}
        />
        <Input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          autoFocus={!!emailRef.current.value}
        />
        <SignUpButton onClick={signIn}>Sign In</SignUpButton>
        <SignUpDescription>
          <DescriptionSpan>New to Netflix?</DescriptionSpan>{" "}
          <SpanLink onClick={register}>Sign Up Now.</SpanLink>
        </SignUpDescription>
      </Form>
    </Container>
  );
};
