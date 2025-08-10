import styled from "styled-components";
import { breakpoints } from "../breakpoints";

export const ProfileContainer = styled.div`
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  box-sizing: border-box;
`;

export const AddProfileContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  width: 100%;
  max-width: 160px;
`;

export const PageTitle = styled.h2`
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 40px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 2rem;
    margin-bottom: 50px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 3rem;
  }
`;

export const AddProfileImage = styled.img`
  width: 72px;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.desktop}px) {
    width: 80px;
    margin-bottom: 18px;
  }
`;

export const ProfileTitle = styled.p`
  color: #fff;
  margin-bottom: 50px;
`;

export const ProfilesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, max-content));
  grid-gap: 16px;
  margin: 0 0 28px 0;
  justify-content: center;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, max-content));
    grid-gap: 20px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
    grid-gap: 25px;
    margin-bottom: 36px;
  }
`;

export const ProfileAvatar = styled.img`
  width: 90px;
  border-radius: 8px;

  @media (min-width: ${breakpoints.tablet}px) {
    width: 112px;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    width: 128px;
  }
`;

export const SingleProfileName = styled.p`
  color: rgb(182, 182, 182);
  font-size: 18px;
  padding-top: 8px;
`;

export const SingleProfileContainer = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 160px;

  &:hover {
    ${ProfileAvatar} {
      border: 3px solid #fff;
      box-sizing: border-box;
    }
    ${SingleProfileName} {
      color: #fff;
    }
  }
`;

export const ManageProfilesButton = styled.button`
  background: transparent;
  width: 200px;
  height: 48px;
  font-size: 1.2rem;
  color: rgb(182, 182, 182);
  border: 2px solid rgb(182, 182, 182);
  cursor: pointer;
  margin-bottom: 48px;

  @media (min-width: ${breakpoints.tablet}px) {
    margin-bottom: 0;
  }
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.4rem;
    width: 220px;
    height: 56px;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: auto;
  cursor: pointer;
  
  &::after {
    content: ${(props) => props.$isedit === "true" ? "''" : "none"};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    z-index: 5;
    opacity: ${(props) => props.$isedit === "true" ? "0.7" : "0"};
  }
`;

export const IconContainer = styled.div`
  background: ${(props) => props.$isedit === "true" ? "#fff" : "transparent"};
`;

export const EditProfileIcon = styled.img`
  z-index: 10;
  height: 40px;
  position: absolute;
  filter: brightness(0) invert(1);
`;

export const AddProfileText = styled.p`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;

  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 1.3rem;
  }
`;
