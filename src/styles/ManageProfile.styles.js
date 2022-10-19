import styled from "styled-components";

export const Container = styled.div`
  width: 75%;
  margin: auto;
  padding-top: 170px;

  max-width: 700px;
`;

export const PageTitle = styled.h1`
  color: #fff;
  font-size: 5rem;
  font-weight: 500;
  padding-bottom: 18px;
  border-bottom: 1px solid grey;
`;

export const AvatarImage = styled.img`
  width: 160px;
  border-radius: 10px;
  margin-right: 42px;
`;

export const NameInput = styled.input`
  height: 52px;
  width: 100%;
  background-color: grey;
  color: #fff;
  font-size: 2rem;
  padding-left: 16px;
`;

export const MiddleContainer = styled.div`
  display: flex;
  padding: 32px 0px;
  border-bottom: 1px solid grey;
  align-items: center;
`;

export const ButtonsContainer = styled.div`
  padding: 32px 0px;
`;

export const TransparentButton = styled.button`
  background: transparent;
  width: 200px;
  height: 48px;
  font-size: 1.4rem;
  color: rgb(182, 182, 182);
  border: 2px solid rgb(182, 182, 182);
  cursor: pointer;
  margin-right: 24px;
  font-weight: 500;

  &:hover {
    border-color: #fff;
    color: #fff;
  }
`;

export const SaveButton = styled(TransparentButton)`
  background: #fff;
  color: #191919;
  border: none;
  margin-bottom: 24px;

  &:hover {
    background: red;
    color: #fff;
  }
`;
