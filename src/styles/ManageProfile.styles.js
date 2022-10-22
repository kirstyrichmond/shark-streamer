import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  width: 80%;
  margin: auto;
  padding-top: 8px;
  z-index: 1;
  max-width: 700px;

  @media (min-width: ${breakpoints.tablet}px) {
    padding-top: 260px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 120px;
  }
`;

export const PageTitle = styled.h1`
  color: #fff;
  padding-bottom: 12px;
  border-bottom: 1px solid grey;
  font-size: 2.6rem;
  font-weight: 500;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 4.5rem;
  }
`;

export const AvatarImage = styled.img`
  width: 88px;
  border-radius: 10px;
  margin-right: 16px;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 160px;
    margin-right: 50px;
  }
`;

export const NameInput = styled.input`
  height: 42px;
  width: 100%;
  background-color: grey;
  color: #fff;
  font-size: 1.2rem;
  padding-left: 16px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2rem;
    height: 52px;
  }
`;

export const MiddleContainer = styled.div`
  display: flex;
  padding: 24px 0px;
  border-bottom: 1px solid grey;
  align-items: center;

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 32px 0px;
  }
`;

export const ButtonsContainer = styled.div`
  padding: 32px 0px;
`;

export const TransparentButton = styled.button`
  background: transparent;
  min-width: 130px;
  height: 48px;
  font-size: 1.4rem;
  color: rgb(182, 182, 182);
  border: 2px solid rgb(182, 182, 182);
  cursor: pointer;
  margin-right: 18px;
  font-weight: 500;

  &:hover {
    border-color: #fff;
    color: #fff;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    width: 200px;
    height: 60px;
    font-size: 1.6rem;
  }
`;

export const SaveButton = styled(TransparentButton)`
  background: #fff;
  color: #191919;
  border: none;
  margin-bottom: 24px;

  &:hover {
    background: red;
    color: #fff;
  }
`;
