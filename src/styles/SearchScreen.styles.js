import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  padding: 0 20px;
  padding-top: 80px;
  min-height: 50vh;
  
  @media (min-width: 770px) {
    padding: 0 60px;
    padding-top: 100px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  @media (min-width: 770px) {
    padding: 60px 0;
  }
`;

export const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.3;
  
  @media (min-width: 770px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #e50914;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (min-width: 770px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 0;
  }
`;

export const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.3;
  
  @media (min-width: 770px) {
    font-size: 1.5rem;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0;
  
  @media (min-width: 770px) {
    gap: 10px;
    margin-top: 10px;
  }
`;

export const FilterButton = styled.button`
  background-color: ${props => props.$isActive ? '#e50914' : '#333'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  min-width: 60px;
  
  @media (min-width: 770px) {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &:hover {
    background-color: ${props => props.$isActive ? '#e50914' : '#444'};
  }
`;

export const ResultsCount = styled.div`
  color: #999;
  font-size: 12px;
  margin-bottom: 16px;
  
  @media (min-width: 770px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 16px;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 20px;
  }
  
  @media (min-width: 770px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 25px;
  }
`;