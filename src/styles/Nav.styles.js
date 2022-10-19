import styled from "styled-components";
import { breakpoints } from "../breakpoints";
import { CDropdownMenu, CDropdownItem } from "@coreui/react";

export const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100vw;
  min-height: 68px;
  height: auto;
  transition-timing-function: ease-in;
  transition: all 0.5s;
  background-color: ${(props) => props.black && "#111"};
  display: flex;
  justify-content: space-between;
`;

export const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  position: absolute;
`;

export const NavLogo = styled.img`
  object-fit: contain;
  cursor: pointer;
  width: 20%;
  max-width: 120px;
  margin: 0 0 8px 12px;

  @media (min-width: ${breakpoints.tablet}px) {
    margin-left: 18px;
    margin-top: 4px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    margin-left: 28px;
    margin-top: 8px;
  }
`;

export const NavAvatar = styled.img`
  width: 32px;
  height: 32px;
  margin: 20px 18px 12px 12px;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;

  @media (min-width: ${breakpoints.tablet}px) {
    margin-right: 24px;
    margin-top: 22px;
    width: 40px;
    height: 40px;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    margin-right: 28px;
  }
`;

export const ProfileName = styled.h3`
  color: #fff;
  position: fixed;
  right: 32px;
  width: 48px;
  top: 75px;
  cursor: pointer;
`;

export const DropdownMenu = styled(CDropdownMenu)`
  display: ${(props) => props.closed && "none"};
  position: fixed;
  right: 12px;
  top: 60px;
  background-color: #191919;
  list-style: none;
  padding: 0.5rem;
  width: 160px;

  @media (min-width: ${breakpoints.tablet}px) {
    right: 22px;
    top: 72px;
  }

  @media (min-width: ${breakpoints.desktop}px) {
    right: 28px;
    width: 200px;
  }
`;

export const DropdownMenuUser = styled(CDropdownItem)`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff;
  border: none;
  background-color: transparent;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  font-size: 1rem;

  @media (min-width: ${breakpoints.desktop}px) {
    padding: 0.5rem 0.7rem;
  }
`;

export const DropdownMenuAvatar = styled.img`
  width: 32px;
  margin-right: 10px;
  border-radius: 4px;

  @media (min-width: ${breakpoints.desktop}px) {
    width: 38px;
  }
`;

export const DropdownMenuUsername = styled.p`
  color: #fff;
  font-size: 0.9rem;

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.1rem;
  }
`;

export const DropdownMenuItem = styled(CDropdownItem)`
  color: #fff;
  border: none;
  background-color: transparent;
  padding: 0.6rem 0.7rem;
  cursor: pointer;
  font-size: 1rem;

  @media (min-width: ${breakpoints.desktop}px) {
    padding: 0.7rem 0.7rem;
    font-size: 1.1rem;
  }
`;

export const SignInButton = styled.button`
  position: fixed;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  padding: 0.5rem 1.2rem;
  right: 25px;
  top: 20px;
  cursor: pointer;
  background-color: #e50914;
  color: #fff;

  @media (min-width: ${breakpoints.desktop}px) {
    top: 26px;
    right: 28px;
  }
`;

export const SearchIcon = styled.img`
  width: 30px;
  margin-top: 22px;
  margin-right: 12px;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}px) {
    margin-top: 26px;
    margin-right: 18px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    width: 36px;
  }
`;

export const Form = styled.form`
  margin-top: 20px;
  margin-right: 14px;
  cursor: pointer;
`;

export const RightContainer = styled.div`
  display: flex;
`;

export const InputContainer = styled.div`
  color: #fff;
  background: #111;
  border: 1.5px solid #fff;
  outline: none;
  font-size: 1.2rem;
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
`;

export const Input = styled.input`
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.2rem;
  padding: 0.3rem 1rem 0.3rem 0.6rem;
`;

export const CancelButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;
