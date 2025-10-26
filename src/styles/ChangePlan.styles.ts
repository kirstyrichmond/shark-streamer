import styled from "styled-components";
import { breakpoints } from "../breakpoints";
import { IoArrowBack } from "react-icons/io5";

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 5rem 0;
`;

export const ScreenContainer = styled.div`
  width: 95%;
  margin: auto;
  max-width: 700px;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  @media (min-width: ${breakpoints.mobile}px) {
    width: 90%;
    padding: 1.5rem;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    width: 80%;
    padding: 2rem;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    width: 75%;
  }
`;

export const CurrentPlan = styled.p`
  margin-bottom: 1.5rem;
`

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}px) {
    margin-bottom: 2rem;
  }
`;

export const BackButtonIcon = styled(IoArrowBack)`
    width: 20px;
    height: 20px;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 24px;
    height: 24px;
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 0.75rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  color: #333;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
  flex: 1;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 1.6rem;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2.3rem;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 2.5rem;
  }
`;

export const PlanContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 2.5rem;
    padding: 2rem;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    margin-bottom: 3rem;
    gap: 3rem;
  }
`;

export const PlanTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.5rem;
    margin: 0;
    min-width: 140px;
    text-align: left;
  }
`;

export const PlanDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1rem;
    margin: 0;
    flex: 2;
    text-align: left;
    max-width: 300px;
    line-height: 1.5;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    max-width: 400px;
  }
`;

export const PlanPrice = styled.p`
  font-size: 1.1rem;
  color: #00acee;
  font-weight: 600;
  margin: 0 0 1rem 0;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    text-align: center;
  }
`;

export const PlanActions = styled.div`
  @media (min-width: ${breakpoints.tablet}px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
  }
`;

export const SubscribeButton = styled.button`
  width: 100%;
  height: 48px;
  background: #00acee;
  border: none;
  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 130px;
    height: 40px;
    padding: 8px 16px;
  }

  &:disabled {
    background: gray !important;
    cursor: not-allowed;
  }
`;
