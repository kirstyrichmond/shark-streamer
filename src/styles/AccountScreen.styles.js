import { Link } from "react-router-dom";
import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  width: 100vw;
  background: #f3f3f3;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 95%;
  padding: 1rem;
  box-sizing: border-box;

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
    max-width: 700px;
  }
`;

export const TopContainer = styled.div`
  display: flex;
`;

export const TopInnerContainer = styled.div`
  margin-left: 28px;
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 400;
  color: #737373;
  margin-bottom: 15px;
  margin-top: 10px;
  padding: 0;

  @media (min-width: ${breakpoints.mobile}px) {
    font-size: 2.2rem;
    margin-bottom: 18px;
    margin-top: 12px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2.75rem;
    margin-bottom: 20px;
    margin-top: 15px;
  }
`;

export const MemberIcon = styled.img`
  width: 28px;
  height: 28px;
  padding-right: 8px;
`;

export const MemberSinceText = styled.p`
  color: #555;
  display: inline-flex;
  font-size: 0.8rem;
  font-weight: 800;
  text-align: center;
`;

export const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 30px;
  border-top: 1px solid #999;
  padding-top: 20px;

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 50px;
    padding-top: 24px;
  }
`;

export const MembershipHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 250px;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    width: 300px;
  }
`;

export const MembershipTitle = styled.div`
  color: #737373;
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 0px;
  padding: 0;
`;

export const CancelMembershipButton = styled.button`
  display: block;
  padding: 1rem 0rem;
  font-size: 16px;
  border: none;
  padding: 12px 1em;
  background-color: #e6e6e6;
  background-image: linear-gradient(180deg, #e6e6e6, #ddd);
  box-shadow: 0 1px 0 rgb(0 0 0 / 20%);
  color: #000;
  cursor: pointer;
  font-size: 0.9rem;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1rem;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 30px;
  border-top: 1px solid #999;
  padding-top: 20px;

  @media (min-width: ${breakpoints.tablet}px) {
    flex-direction: row;
    gap: 2rem;
    padding-bottom: 50px;
    padding-top: 24px;
  }
`;

export const PlanHeader = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 150px;
    margin-bottom: 0;
  }
`;

export const PlanTitle = styled.h2`
  color: #737373;
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 0px;
  padding: 0;
`;

export const ChangePlanContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

export const PlanTypeContainer = styled.div`
  display: flex;
`;

export const PlanTypeTitle = styled.h4`
  padding-top: 2px;
`;

export const HdIcon = styled.img`
  width: 32px;
  margin-left: 8px;
  margin-top: -5px;
`;

export const ChangePlanButtonLink = styled(Link)`
  text-decoration: none;
  color: #0073e6;
  font-size: 1.1rem;
`;

export const SignOutButton = styled.button`
  background-color: #e50914;
  border: none;
  color: #fff;
  padding: 1rem 0rem;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.8rem;
`;

export const EmailText = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
