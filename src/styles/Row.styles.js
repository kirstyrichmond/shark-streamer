import styled from "styled-components";
import { css } from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  color: #fff;
  margin-left: 20px;
  margin-top: 16px;
`;

export const Title = styled.h2`
  color: #999;
  font-size: 1rem;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.2rem;
  }
`;

export const MovieContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 12px 0 12px 0;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const MovieImage = styled.img`
  cursor: pointer;
  object-fit: contain;
  margin-right: 6px;
  width: 42vw;
  max-width: 200px;
  transition: transform 450ms;

  ${(props) =>
    props.large &&
    css`
      width: 36vw;
      max-width: 200px;
      margin-right: 10px;
    `}
`;
