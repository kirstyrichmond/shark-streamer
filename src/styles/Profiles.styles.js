import styled from "styled-components";

export const ProfileContainer = styled.div`
  margin: auto;
  padding-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AddProfileContainer = styled.div`
  cursor: pointer;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
`;

export const PageTitle = styled.h2`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 80px;
`;

export const AddProfileImage = styled.img`
  width: 72px;
  margin-bottom: 12px;
`;

export const ProfileTitle = styled.p`
  color: #fff;
  margin-bottom: 50px;
`;

export const ProfilesRow = styled.div`
  display: flex;
  margin-bottom: 80px;
`;

export const ProfileAvatar = styled.img`
  width: 100px;
  border-radius: 8px;
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
`;

export const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: auto;
`;

export const IconContainer = styled.div`
  background: ${(props) => props.edit && "#fff"};
`;

export const EditProfileIcon = styled.img`
  z-index: 10;
  height: 40px;
  position: absolute;
`;

export const AddProfileText = styled.p`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
`;
