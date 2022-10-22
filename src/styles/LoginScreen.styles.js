import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  background: url("https://assets.nflxext.com/ffe/siteui/vlv3/b321426e-35ae-4661-b899-d63bca17648a/e30a1639-d705-4d84-9835-b06b9c013e2c/GB-en-20220926-popsignuptwoweeks-perspective_alpha_website_large.jpg")
    center no-repeat;
  background-size: cover;
  height: 100vh;
  overflow-y: hidden;
`;

export const BodyContainer = styled.div`
  z-index: 1;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  position: absolute;
  padding-top: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  @media (min-width: ${breakpoints.tablet}px) {
    padding-top: 300px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 340px;
  }
`;

export const InputContainer = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  padding: 0.8rem 1.5rem 0.7rem 0.8rem;
  outline-width: 0;
  width: 100%;
  border: none;
  max-width: 298px;
  font-size: 0.8rem;
  border-radius: 2px;
  margin-bottom: 16px;

  @media (min-width: ${breakpoints.tablet}px) {
    border-radius: 2px 0 0 2px;
    padding: 1rem 2.4rem 1rem 0.8rem;
    font-size: 1.2rem;
    max-width: 320px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.2rem;
    max-width: 360px;
    padding: 1rem 2.4rem 1rem 1rem;
  }
`;

export const GetStartedButton = styled.button`
  font-size: 0.9rem;
  border-radius: 2px;
  max-width: 130px;
  height: 36px;
  margin: auto;
  margin-bottom: 10px;
  border: none;
  color: #fff;
  background-color: #e50914;
  border: none;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 1rem 1.4rem 1rem 1.4rem;
    height: auto;
    margin: 0;
    font-size: 1.2rem;
    border-radius: 0 2px 2px 0;
    max-width: 150px;
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
  font-size: 1.7rem;
  margin-bottom: 16px;
  max-width: 900px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 3.2rem;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 4.2rem;
  }
`;

export const DescOne = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 18px;
  font-weight: 400;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.7rem;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 2rem;
  }
`;

export const DescTwo = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.2rem;
    margin-bottom: 32px;
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
