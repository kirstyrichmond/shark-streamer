import styled from "styled-components";

export const SearchAllMovieContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 100px 24px;
  width: 100%;

  @media (min-width: 1100px) {
    padding: 100px 30px;
  }
`;

export const SearchMovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  margin-bottom: 38px;
  cursor: pointer;
  width: 30%;

  @media (min-width: 800px) {
    width: 23%;
  }
  @media (min-width: 1100px) {
    width: 18.5%;
  }
`;

export const SearchMovieImage = styled.img`
  width: auto;
`;

export const SearchMovieTitle = styled.h4`
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
`;

export const SearchIcon = styled.img`
  width: 40px;
  position: fixed;
  right: 120px;
  z-index: 1;
  top: 28px;
  cursor: pointer;
`;
