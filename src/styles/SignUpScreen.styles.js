import styled from "styled-components";
import { breakpoints } from "../breakpoints";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Container = styled.div`
  min-height: 100vh;
`;

export const InnerContainer = styled.div`
  margin: auto;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: ${breakpoints.tablet}px) {
    align-items: flex-start;
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

export const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const PasswordInput = styled.input`
  outline-width: 0;
  outline: none;
  width: 100%;
  height: 50px;
  margin-bottom: 18px;
  padding: 0px 50px 0px 20px;
  font-size: 1.2rem;
  background: #333;
  border: none;
  border-radius: 4px;
  top: 50%;
  color: #8c8c8c;
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 15px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  padding: 0;
  z-index: 1;
  
  &:hover {
    color: #fff;
  }
`;

export const EyeIcon = styled(AiOutlineEye)`
  font-size: 20px;
`;

export const EyeSlashIcon = styled(AiOutlineEyeInvisible)`
  font-size: 20px;
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
