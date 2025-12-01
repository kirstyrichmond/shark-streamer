import styled from "styled-components";
import { breakpoints } from "../breakpoints";

interface CategoryTabProps {
  $active?: boolean;
}

interface AvatarOptionProps {
  $selected?: boolean;
}

export const AvatarPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const AvatarPickerModal = styled.div`
  background: #141414;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);

  @media (min-width: ${breakpoints.tablet}px) {
    width: 600px;
  }
`;

export const AvatarPickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #333;
`;

export const AvatarPickerTitle = styled.h2`
  color: #fff;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2.2rem;
  }
`;

export const AvatarPickerClose = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ccc;
  }
`;

export const AvatarPickerContent = styled.div`
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
`;

export const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

export const CategoryTab = styled.button<CategoryTabProps>`
  background: ${(props) => (props.$active ? "#00acee" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "#ccc")};
  border: 2px solid ${(props) => (props.$active ? "#00acee" : "#666")};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.$active ? "#00acee" : "#999")};
    color: ${(props) => (props.$active ? "#fff" : "#fff")};
  }

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 12px 24px;
    font-size: 1.1rem;
  }
`;

export const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: ${breakpoints.tablet}px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
  }
`;

export const AvatarOption = styled.div<AvatarOptionProps>`
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${(props) => (props.$selected ? "#00acee" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.$selected ? "#00acee" : "#fff")};
    transform: scale(1.05);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;

  @media (min-width: ${breakpoints.tablet}px) {
    height: 100px;
  }
`;

export const UploadSection = styled.div`
  border-top: 1px solid #333;
  padding-top: 24px;
  text-align: center;
`;

export const UploadButton = styled.button`
  background: transparent;
  color: #fff;
  border: 2px solid #666;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    border-color: #00acee;
    color: #00acee;
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const LoadingText = styled.p`
  color: #ccc;
  text-align: center;
  font-size: 1.1rem;
  margin: 40px 0;
`;
