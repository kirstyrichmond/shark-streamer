import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profiles } from "../features/userSlice";
import {
  AvatarImage,
  ButtonsContainer,
  Container,
  MiddleContainer,
  NameInput,
  PageTitle,
  SaveButton,
  TransparentButton,
} from "../styles/ManageProfile.styles";

export const ManageProfile = ({ profileName, setEditProfilePage }) => {
  const usersState = useSelector(profiles);
  const dispatch = useDispatch();
  const newUsername = useRef();
  const [selectedProfile, setSelectedProfile] = useState({});

  const updateUsername = (e) => {
    const arrayCopy = [...usersState.payload.user.user.profiles];
    e.preventDefault();

    let selectedProfileIndex = arrayCopy.findIndex((profile) => {
      setSelectedProfile(profile);
      return profile.name === profileName;
    });

    arrayCopy[selectedProfileIndex] = {
      ...selectedProfile,
      name: newUsername.current.value,
    };

    dispatch(profiles(arrayCopy));
    setEditProfilePage(false);
  };

  return (
    <Container>
      <div>
        <PageTitle>Edit Profile</PageTitle>
      </div>
      <MiddleContainer>
        <AvatarImage
          src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
          alt="profile"
        />
        <NameInput type="text" ref={newUsername} defaultValue={profileName} />
      </MiddleContainer>
      <ButtonsContainer>
        <SaveButton onClick={(e) => updateUsername(e)}>Save</SaveButton>
        <TransparentButton onClick={() => setEditProfilePage(false)}>
          Cancel
        </TransparentButton>
        <TransparentButton>Delete profile</TransparentButton>
      </ButtonsContainer>
    </Container>
  );
};
