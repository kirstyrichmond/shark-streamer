import styled from "styled-components";

export const SearchAllMovieContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 100px 24px;
  width: 100%;
  gap: 1rem;
  background-color: #111;
  min-height: 100vh;

  @media (min-width: 1100px) {
    padding: 100px 30px;
  }
`;

export const SearchMovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 38px;
  cursor: pointer;
  width: 30%;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 800px) {
    width: 23%;
  }
  @media (min-width: 1100px) {
    width: 18.5%;
  }
`;

export const SearchMovieImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;

  @media (min-width: 800px) {
    height: 170px;
  }
`;

export const SearchMovieTitle = styled.h4`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 0.5rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const SearchResultsHeading = styled.h2`
  color: white;
  margin: 84px 0 0 24px;
  font-size: 1.6rem;

  @media (min-width: 1100px) {
    margin-left: 30px;
  }
`;

export const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  color: white;
  text-align: center;
  padding: 0 20px;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #aaa;
    max-width: 500px;
  }
`;

export const SearchIcon = styled.img`
  width: 40px;
  position: fixed;
  right: 120px;
  z-index: 1;
  top: 28px;
  cursor: pointer;
`;
