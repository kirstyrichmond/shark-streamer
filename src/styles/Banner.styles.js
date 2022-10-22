import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const BannerContainer = styled.div`
  position: relative;
  height: 70vw;
  color: white;
  object-fit: contain;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (min-width: ${breakpoints.tablet}px) {
    height: 44vw;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    height: 36vw;
  }
`;

export const BannerContent = styled.div`
  max-width: 50%;
  padding: 4.8% 4.7%;

  @media (min-width: ${breakpoints.tablet}px) {
    max-width: 44%;
    padding: 3% 3%;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    max-width: 44%;
    padding: 2.2% 3%;
  }
`;

export const BannerTitle = styled.h1`
  font-size: 3vw;
  font-weight: 700;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 3.7vw;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 3.2vw;
  }
`;

export const BannerDescription = styled.p`
  line-height: 1.1;
  padding-top: 0.4rem;
  padding-bottom: 0.6rem;
  font-size: 2vw;
  font-weight: 400;
  max-height: 80px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.4vw;
    line-height: 1.2;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 1rem;
    padding-bottom: 1.4rem;
    padding-right: 7rem;
    font-size: 1.1vw;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;

export const PlayButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #000;
  outline: none;
  border: none;
  font-weight: 700;
  font-size: 0.6rem;
  border-radius: 4px;
  margin-right: 1rem;
  background-color: #fff;
  padding: 1% 4%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.7);
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 0.8rem;
    padding: 0 3.4%;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.2rem;
    padding: 0 3.4%;
  }
`;

export const PlayIcon = styled.img`
  width: 14px;
  margin-right: 0.4rem;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 16px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    width: 20px;
    margin-right: 0.7rem;
  }
`;

export const InfoButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  outline: none;
  border: none;
  font-weight: 600;
  font-size: 0.6rem;
  border-radius: 4px;
  margin-right: 1rem;
  background-color: rgba(109, 109, 110, 0.7);
  padding: 1.2% 3%;

  &:hover {
    background-color: rgba(109, 109, 110, 0.4);
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 0.8rem;
    padding: 1.6% 3%;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.2rem;
    padding: 1.2% 2.2%;
  }
`;

export const InfoIcon = styled.img`
  width: 16px;
  margin-right: 0.4rem;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 18px;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    width: 24px;
    margin-right: 0.7rem;
  }
`;

export const BottomFade = styled.div`
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 68%,
    #141414
  );
  height: 70px;
`;
