import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div<{ $isSelected: boolean }>`
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
  
  ${props => props.$isSelected && `
    border: 2px solid #1a237e;
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