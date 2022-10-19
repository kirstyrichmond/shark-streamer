import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const ModalContainer = styled.div`
  height: 75vh;
  width: 90vw;
  background: #141414;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 60vw;
    height: 80vh;
  }
`;

export const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  height: 340px;

  @media (min-width: ${breakpoints.tablet}px) {
    height: 500px;
  }
`;

export const TrailerContainer = styled.div`
  height: 400px;
`;

export const MovieCoverImage = styled.img`
  width: 100%;
  object-fit: cover;
  height: 340px;

  @media (min-width: ${breakpoints.tablet}px) {
    height: 500px;
  }
`;

export const MovieTitle = styled.h2`
  font-size: 1.4rem;
  color: #fff;
  position: absolute;
  z-index: 10;
  left: 24px;
  bottom: 60px;
  max-width: 300px;

  @media (min-width: ${breakpoints.tablet}px) {
    bottom: 64px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.6rem;
    max-width: 600px;
  }
`;

export const CloseButtonContainer = styled.div``;

export const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.75);
`;

export const CloseButton = styled.img`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 8px;
  width: 34px;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 40px;
  }
`;

export const PlayButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #000;
  outline: none;
  border: none;
  font-weight: 700;
  font-size: 0.8rem;
  border-radius: 4px;
  margin-right: 1rem;
  background-color: #fff;
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
  position: absolute;
  bottom: 20px;
  left: 24px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1rem;
    padding: 0.4rem 0.7rem 0.4rem 0.7rem;
  }
`;

export const PlayIcon = styled.img`
  width: 16px;
  margin-right: 0.6rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.7);
  }
`;

export const MovieInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 36px;
`;

export const ReleaseDate = styled.p`
  color: #fff;
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 24px;
`;

export const MovieDescription = styled.p`
  color: #fff;
  font-weight: 400;
  font-size: 0.8rem;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.1rem;
  }
`;
