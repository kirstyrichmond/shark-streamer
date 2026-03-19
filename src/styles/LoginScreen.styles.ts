import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  background: url("/assets/shark-streamer-login-background-image.jpg")
    center no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;

  @media (max-width: ${breakpoints.mobile}px) {
    background-position: center top;
  }
`;

export const BodyContainer = styled.div`
  z-index: 1;
  color: #fff;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.85) 100%);

  @media (min-width: ${breakpoints.mobile}px) {
    padding: 20px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%);
  }
`;

export const InputContainer = styled.div<{ hasError?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  ${props => props.hasError && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
      pointer-events: none;
    }
  `}

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.8rem 0.6rem;
  outline-width: 0;
  width: 100%;
  border: 2px solid ${props => props.hasError ? "#dc2626" : "transparent"};
  max-width: 280px;
  font-size: 1rem;
  border-radius: 4px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  -webkit-appearance: none;

  &::placeholder {
    color: #757575;
  }

  &:focus {
    border-color: ${props => props.hasError ? "#dc2626" : "#fff"};
  }

  @media (min-width: ${breakpoints.tablet}px) {
    border-radius: 2px 0 0 2px;
    font-size: 1rem;
    max-width: 280px;
    padding: 0.6rem 1.5rem 0.6rem 0.9rem;
    margin: 0;
  }
`;

export const GetStartedButton = styled.button`
  font-size: 1rem;
  border-radius: 4px;
  width: 100%;
  max-width: 280px;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 10px;
  border: none;
  color: #fff;
  background-color: #0066cc;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0052a3;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 1rem 1.4rem;
    height: auto;
    margin: 0;
    border-radius: 0 2px 2px 0;
    max-width: 150px;
    width: auto;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 535.5px;
  margin: auto;

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    max-width: 700px;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 16px;
  max-width: 320px;
  line-height: 1.2;
  font-weight: 700;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 1.8rem;
    max-width: 400px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 3.2rem;
    max-width: 700px;
  }
`;

export const DescOne = styled.h2`
  font-size: 1rem;
  margin-bottom: 16px;
  font-weight: 400;
  line-height: 1.3;
  max-width: 320px;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 1.2rem;
    max-width: 400px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.6rem;
    margin-bottom: 18px;
    max-width: none;
  }
`;

export const DescTwo = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 20px;
  line-height: 1.4;
  max-width: 320px;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 0.8rem;
    max-width: 400px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    max-width: none;
  }
`;

export const Gradient = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.98) 0, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.6) 100%);
`;

export const ErrorText = styled.div`
  color: #ff4444;
  font-size: 18px;
  font-weight: 500;
  margin-top: 12px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;

  @media (min-width: ${breakpoints.mobile}px) {
    max-width: 298px;
    margin-top: 8px;
    font-size: 14px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    max-width: 470px;
    margin-left: 0;
    margin-right: 0;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    max-width: 540px;
  }
`;
