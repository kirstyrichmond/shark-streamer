import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const Container = styled.div`
  position: fixed;
  top: 0;
  // padding: 20px;
  width: 100%;
  height: 60px;
  z-index: 8;
  display: flex;
  justify-content: space-between;
  // background-color: ${(props) => props.isblack === true ? "#111" : "#fff"};
  transition-timing-function: ease-in;
  transition: all 0.5s;

  @media (max-width: 390px) {
    padding: 13px;
  }
`;

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  justify-content: flex-end;
  padding-right: 50px;
  gap: 10px;
  @media (max-width: 390px) {
    padding-right: 20px;
  }
`;

export const NavLogo = styled.img`
  object-fit: contain;
  cursor: pointer;
  width: 24%;
  max-width: 120px;
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
  position: fixed;
  right: 20px;
  padding: 7px 17px;
  font-size: 1rem;
  color: white;
  background-color: #e50914;
  border: none;
  cursor: pointer;
  border-radius: 3px;

  @media (max-width: 390px) {
    right: 13px;
    padding: 5px 12px;
    font-size: 0.8rem;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 30px;
`;

// Fixed: Using props directly instead of hasAttribute

export const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isclosed",
})`
  position: absolute;
  top: 40px;
  right: 50px;
  background-color: rgba(0, 0, 0, 0.851);
  width: 180px;
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 5px;
  padding: 10px 0;
  display: ${(props) => (props.isclosed === "true" ? "none" : "block")};
  z-index: 40;

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
  justify-content: center;
  color: white;
  font-size: 13px;
  padding: 10px 0px;
  font-weight: 600;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  text-align: center;

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
`;

export const Input = styled.input`
  width: 200px;
  background-color: rgba(0, 0, 0, 0.75);
  border: 1px solid white;
  color: white;
  padding: 5px 40px 5px 10px;
  height: 100%;
  border-radius: 4px;
  outline: none;
  
  &::placeholder {
    color: #aaa;
    font-size: 0.9rem;
  }
  
  @media (min-width: 768px) {
    width: 240px;
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
`;

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
`;
