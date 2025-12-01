import styled from "styled-components";

export const Container = styled.div`
  padding: 80px 20px;
  min-height: 100vh;

  @media (min-width: 770px) {
    padding: 100px 60px;
  }
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

export const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

export const NoResultsTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  font-weight: 600;

  @media (min-width: 770px) {
    font-size: 2rem;
  }
`;

export const NoResultsMessage = styled.p`
  color: #999;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 0 2rem 0;

  @media (min-width: 770px) {
    font-size: 1.1rem;
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
