import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  height: 100vh;
  overflow-y: hidden;
`;

export const InnerContainer = styled.div`
  padding-top: 124px;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  @media (min-width: ${breakpoints.tablet}px) {
    padding-top: 300px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 360px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 18px;
  width: 100%;
  max-width: 440px;

  @media (min-width: ${breakpoints.tablet}px) {
    max-width: 500px;
  }
`;

export const Title = styled.h1`
  color: #fff;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 28px;
`;

export const Input = styled.input`
  outline-width: 0;
  outline: none;

  height: 50px;
  margin-bottom: 18px;
  padding: 0px 20px 0px;
  font-size: 1.2rem;
  background: #333;
  border: none;
  border-radius: 4px;
  top: 50%;
  color: #8c8c8c;
`;

export const SignUpButton = styled.button`
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 28px;
  background: #e50914;
  line-height: 1rem;
  padding: 20px;
  cursor: pointer;
  border: none;
  color: #fff;

  @media (min-width: ${breakpoints.tablet}px) {
    max-width: 500px;
    font-size: 20px;
  }
`;

export const SignUpDescription = styled.h4`
  font-size: 16px;
  font-weight: 500;
  text-align: center;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 18px;
  }
`;

export const DescriptionSpan = styled.span`
  color: #737373;
  margin-top: 16px;
`;

export const SpanLink = styled(DescriptionSpan)`
  color: #fff;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
