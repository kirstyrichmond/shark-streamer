import styled from "styled-components";
import { breakpoints } from "../breakpoints";

interface DropdownMenuProps {
  isclosed: "true" | "false";
}

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  z-index: 12;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  transition-timing-function: ease-in;
  transition: background 0.3s ease;

  @media (max-width: 450px) {
    padding: 0 12px;
    height: 52px;
  }
  
  @media (min-width: ${breakpoints.tablet}px) {
    height: 60px;
    padding: 0 20px;
  }
`;

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  
  @media (max-width: 450px) {
    gap: 8px;
  }
`;

export const NavLogo = styled.img`
  object-fit: contain;
  cursor: pointer;
  width: 80px;
  flex-shrink: 0;
  
  @media (max-width: 450px) {
    width: 70px;
  }
  
  @media (min-width: ${breakpoints.tablet}px) {
    width: 100px;
    max-width: 120px;
  }
`;

export const NavAvatar = styled.img`
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 5px;

  @media (max-width: 390px) {
    width: 23px;
    height: 23px;
    right: 13px;
  }
`;

export const ProfileName = styled.p`
  margin-left: 10px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  
  @media (max-width: 450px) {
    display: none;
  }
`;

export const SignInButton = styled.button`
  padding: 6px 14px;
  font-size: 0.9rem;
  color: white;
  background-color: #00acee;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-height: 36px;
  flex-shrink: 0;
  white-space: nowrap;
  
  &:hover {
    background-color: #303f9f;
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 450px) {
    padding: 4px 10px;
    font-size: 0.8rem;
    min-height: 32px;
  }
  
  @media (min-width: ${breakpoints.tablet}px) {
    padding: 7px 17px;
    font-size: 1rem;
    min-height: 40px;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 30px;
`;

export const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isclosed",
})<DropdownMenuProps>`
  top: 58px;
  right: 14px;
  width: 180px;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.851);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 5px;
  padding: 10px 0;
  display: ${(props) => (props.isclosed === "true" ? "none" : "block")};
  z-index: 40;

  @media (min-width: 390px) {
    top: 58px;
    right: 14px;
    width: 180px;
  }
  @media (min-width: 450px) {
    top: 52px;
    right: 40px;
    width: 180px;
  }
  @media (min-width: 800px) {
    top: 58px;
    right: 34px;
    width: 160px;
  }

  &::after {
    content: "";
    position: absolute;
    top: -10px;
    right: 15px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.851) transparent;
  }
`;

export const DropdownMenuUser = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

export const DropdownMenuAvatar = styled.img`
  width: 32px;
  margin-right: 10px;
  border-radius: 5px;
`;

export const DropdownMenuUsername = styled.span`
  margin-top: 5px;
  color: white;
`;

export const DropdownMenuItem = styled.div`
  display: flex;
  color: white;
  font-size: 13px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  height: 30px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    margin-right: 8px;
  }
`;

export const Input = styled.input`
  width: 160px;
  background-color: rgba(0, 0, 0, 0.75);
  border: 1px solid white;
  color: white;
  padding: 5px 40px 5px 10px;
  height: 100%;
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  
  &::placeholder {
    color: #aaa;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    padding: 5px 30px 5px 8px;
    
    &::placeholder {
    }
  }
  
  @media (min-width: 768px) {
    width: 240px;
    
    &::placeholder {
    }
  }
`;

export const CancelButton = styled.button`
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 480px) {
    right: 5px;
    font-size: 0.9rem;
  }
`;

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;
