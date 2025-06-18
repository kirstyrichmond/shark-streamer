import styled from "styled-components";

export const Container = styled.div`
  margin-left: 20px;
  color: white;
`;

export const Title = styled.h2`
  margin-left: 20px;
`;

export const RowContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Posters = styled.div`
  display: flex;
  transition: transform 450ms;
`;

export const PosterImage = styled.img`
  max-height: 125px;
  object-fit: contain;
  margin-right: 15px;
  transition: transform 450ms;
  cursor: pointer;

  &:hover {
    transform: scale(1.08);
    opacity: 1;
  }

  @media (max-width: 768px) {
    max-height: 90px;
  }
`;

export const PosterLarge = styled.img`
  max-height: 250px;
  object-fit: contain;
  margin-right: 15px;
  transition: transform 450ms;
  cursor: pointer;

  &:hover {
    transform: scale(1.09);
    opacity: 1;
  }

  @media (max-width: 768px) {
    max-height: 140px;
  }
`;