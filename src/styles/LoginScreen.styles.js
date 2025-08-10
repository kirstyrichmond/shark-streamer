import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  background: url("https://assets.nflxext.com/ffe/siteui/vlv3/b321426e-35ae-4661-b899-d63bca17648a/e30a1639-d705-4d84-9835-b06b9c013e2c/GB-en-20220926-popsignuptwoweeks-perspective_alpha_website_large.jpg")
    center no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  
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
  background-color: rgba(0, 0, 0, 0.6);

  @media (min-width: ${breakpoints.mobile}px) {
    padding: 20px;
  }
  
  @media (min-width: ${breakpoints.tablet}px) {
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-start;
    padding-top: 300px;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 340px;
  }
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const Input = styled.input`
  padding: 1rem 0.8rem;
  outline-width: 0;
  width: 100%;
  border: none;
  max-width: 280px;
  font-size: 1rem;
  border-radius: 4px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  -webkit-appearance: none;
  
  &::placeholder {
    color: #757575;
  }

  @media (min-width: ${breakpoints.mobile}px) {
    max-width: 298px;
    font-size: 1.1rem;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    border-radius: 2px 0 0 2px;
    padding: 1rem 2.4rem 1rem 0.8rem;
    font-size: 1.2rem;
    max-width: 320px;
    margin: 0;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.2rem;
    max-width: 360px;
    padding: 1rem 2.4rem 1rem 1rem;
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
  background-color: #e50914;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f40612;
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (min-width: ${breakpoints.mobile}px) {
    max-width: 298px;
    font-size: 1.1rem;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 1rem 1.4rem;
    height: auto;
    margin: 0;
    font-size: 1.2rem;
    border-radius: 0 2px 2px 0;
    max-width: 150px;
    width: auto;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.2rem;
    max-width: 180px;
    padding: 1rem 2.4rem 1rem 2rem;
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
    max-width: 900px;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 4.2rem;
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
    font-size: 1.7rem;
    margin-bottom: 18px;
    max-width: none;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 2rem;
  }
`;

export const DescTwo = styled.h3`
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 20px;
  line-height: 1.4;
  max-width: 320px;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 1rem;
    max-width: 400px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.2rem;
    margin-bottom: 32px;
    max-width: none;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.4rem;
    margin-bottom: 32px;
  }
`;

export const Gradient = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
`;
