import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  position: relative;
  background-color: #111;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (min-width: ${breakpoints.tablet}px) {
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  &:hover {
    transform: scale(1.03);
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    
    @media (min-width: ${breakpoints.tablet}px) {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }
  }
  
  ${props => props.isSelected && `
    border: 2px solid #e50914;
  `}
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    opacity: 1;
    
    @media (min-width: ${breakpoints.tablet}px) {
      transform: scale(1.08);
    }
  }
`;

export const NoImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NoImageText = styled.p`
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 0 8px;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 14px;
  }
`;

export const Info = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2), transparent);
  transition: height 0.3s ease;
  height: ${props => (props.isHovered ? "60%" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
  @media (min-width: ${breakpoints.tablet}px) {
    padding: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2), transparent);
    height: ${props => (props.isHovered ? "100%" : "auto")};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h3`
  color: white;
  font-size: 12px;
  margin: 0;
  font-weight: 700;
  flex: 1;
  line-height: 1.2;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 14px;
  }
`;

export const MediaType = styled.span`
  color: #999;
  font-size: 9px;
  border: 1px solid #999;
  padding: 1px 3px;
  border-radius: 2px;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 3px;
  }
`;

export const Overview = styled.p`
  color: #ddd;
  font-size: 10px;
  margin: 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 12px;
    margin: 5px 0;
    -webkit-line-clamp: 4;
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  
  @media (min-width: ${breakpoints.tablet}px) {
    margin-top: 5px;
  }
`;

export const Rating = styled.span`
  color: #46d369;
  font-size: 10px;
  font-weight: bold;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 12px;
  }
`;

export const ReleaseDate = styled.span`
  color: #ccc;
  font-size: 10px;
  
  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 12px;
  }
`;