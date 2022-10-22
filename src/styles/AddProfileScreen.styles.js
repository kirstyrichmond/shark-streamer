import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const AddProfileContainer = styled.div`
  width: 75%;
  height: 100%;
  margin: auto;
  padding-top: 120px;
  z-index: 1;
  max-width: 700px;

  @media (min-width: ${breakpoints.tablet}px) {
    padding-top: 260px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 300px;
  }
`;

export const AddProfileHeader = styled.div`
  border-bottom: 1px solid #666;
  padding-bottom: 24px;
  margin-bottom: 28px;

  @media (min-width: ${breakpoints.tablet}px) {
    padding-bottom: 28px;
  }
`;

export const AddProfileTitle = styled.h1`
  color: #fff;
  font-size: 2.6rem;
  font-weight: 500;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 4.5rem;
  }
`;

export const Description = styled.p`
  color: #666;
  font-size: 1.3rem;
  font-weight: 400;
  padding-right: 10px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.8rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  font-size: 1.2rem;
  background: #666;
  color: #fff;
  padding-left: 18px;
  font-weight: 500;
  outline: none;
  letter-spacing: 1px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.8rem;
    height: 50px;
  }
`;

export const InputContainer = styled.div`
  border-bottom: 1px solid #666;
  padding-bottom: 38px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
`;

export const ContinueButton = styled.button`
  background: #fff;
  color: #191919;
  width: 120px;
  height: 48px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-right: 18px;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 200px;
    height: 60px;
    font-size: 1.6rem;
    margin-right: 50px;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #666;
  width: 120px;
  height: 48px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 200px;
    height: 60px;
    font-size: 1.6rem;
  }
`;

export const AvatarImg = styled.img`
  width: 88px;
  margin-right: 16px;
  border-radius: 8px;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 160px;
    margin-right: 50px;
  }
`;
