import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  background: url("https://assets.nflxext.com/ffe/siteui/vlv3/b321426e-35ae-4661-b899-d63bca17648a/e30a1639-d705-4d84-9835-b06b9c013e2c/GB-en-20220926-popsignuptwoweeks-perspective_alpha_website_large.jpg")
    center no-repeat;
  background-size: cover;
  height: 100vh;
`;

export const BodyContainer = styled.div`
  z-index: 1;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  position: absolute;
  top: 25%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 80px;
`;

export const Input = styled.input`
  padding: 1rem 1.5rem 1rem 1.2rem;
  outline-width: 0;
  height: 100%;
  width: 54%;
  border: none;
  max-width: 400px;
  font-size: 1.2rem;

  @media (min-width: ${breakpoints.desktop}px) {
    width: 58%;
    font-size: 1.4rem;
  }
`;

export const GetStartedButton = styled.button`
  padding: 1rem 2.7rem;
  font-size: 1.2rem;
  height: 100%;
  margin-bottom: 10px;
  border: none;
  color: #fff;
  background-color: #e50914;
  border: none;
  cursor: pointer;

  @media (min-width: ${breakpoints.desktop}px) {
    padding: 1rem 4rem;
    font-size: 1.4rem;
  }
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 3.4rem;
  margin-bottom: 20px;
  max-width: 900px;

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 4.2rem;
  }
`;

export const DescOne = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 30px;
  font-weight: 400;

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 2.2rem;
  }
`;

export const DescTwo = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 42px;

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.4rem;
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
