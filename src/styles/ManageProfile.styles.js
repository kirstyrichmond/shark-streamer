import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  width: 80%;
  margin: auto;
  padding-top: 8px;
  z-index: 1;
  max-width: 700px;

  @media (min-width: ${breakpoints.tablet}px) {
    padding-top: 260px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 120px;
  }
`;

export const PageTitle = styled.h1`
  color: #fff;
  padding-bottom: 12px;
  border-bottom: 1px solid grey;
  font-size: 2.6rem;
  font-weight: 500;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 4.5rem;
  }
`;

export const AvatarUploadContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: inline-block;
  margin-right: 16px;

  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    margin-right: 50px;
  }
`;

export const AvatarImage = styled.img`
  width: 88px;
  border-radius: 10px;
  opacity: ${(props) => props.$loading ? 0.6 : 1};
  transition: opacity 0.3s ease;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 160px;
  }
`;

export const AvatarLoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  pointer-events: none;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 14px;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const NameInput = styled.input`
  height: 42px;
  width: 100%;
  background-color: grey;
  color: #fff;
  font-size: 1.2rem;
  padding-left: 16px;
  margin: 0 20px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2rem;
    height: 52px;
  }
`;

export const MiddleContainer = styled.div`
  display: flex;
  padding: 24px 0px;
  border-bottom: 1px solid grey;
  align-items: center;

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 32px 0px;
  }
`;

export const ButtonsContainer = styled.div`
  padding: 32px 0px;
`;

export const TransparentButton = styled.button`
  background: transparent;
  min-width: 130px;
  height: 48px;
  font-size: 1.4rem;
  color: rgb(182, 182, 182);
  border: 2px solid rgb(182, 182, 182);
  cursor: pointer;
  margin-right: 18px;
  font-weight: 500;

  &:hover {
    border-color: #fff;
    color: #fff;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    width: 200px;
    height: 60px;
    font-size: 1.6rem;
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

export const CheckboxContainer = styled.div`
  margin-top: 20px;
  padding: 16px 0;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;

  input[type="checkbox"] {
    transform: scale(1.2);
    cursor: pointer;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 1.6rem;
    gap: 16px;

    input[type="checkbox"] {
      transform: scale(1.5);
    }
  }
`;

export const AvatarPlaceholder = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 8px;
  border: 2px dashed #666;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #666;
  font-size: 14px;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 144px;
    height: 144px;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    width: 160px;
    height: 160px;
  }
`;
