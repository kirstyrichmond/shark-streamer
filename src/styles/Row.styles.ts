import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

export const Container = styled.div`
  color: white;
  padding: 12px 0;

  @media (min-width: 768px) {
    margin-left: 20px;
  }
`;

export const Title = styled.h2`
  margin-left: 20px;
  padding-bottom: 8px;
`;

export const RowContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 0 20px;
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

export const ResponsiveSkeleton = styled(Skeleton)`
  width: 166px;
  height: 250px;
  margin-right: 15px;

  @media (max-width: 768px) {
    width: 94px;
    height: 140px;
  }
`;
