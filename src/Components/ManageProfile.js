import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, selectUser } from "../features/userSlice";
import db from "../firebase";
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

export const ManageProfile = ({
  profileName,
  setEditProfilePage,
  selectedProfile,
}) => {
  const userState = useSelector(selectUser);
  const dispatch = useDispatch();
  const newUsername = useRef();

  const updateProfile = async (e) => {
    e.preventDefault();

    dispatch(
      editProfile({
        selectedProfile: selectedProfile,
        newUsername: newUsername.current.value,
      })
    );

    const docRef = await db
      .collection("customers")
      .doc(userState.info.uid)
      .collection("profiles")
      .where("id", "==", selectedProfile.id)
      .get();

    docRef.forEach((doc) => {
      const profileRef = db
        .collection("customers")
        .doc(userState.info.uid)
        .collection("profiles")
        .doc(doc.id);

      profileRef.update({
        name: newUsername.current.value,
      });
    });
    setEditProfilePage(false);
  };

  const deleteProfile = async () => {
    const docRef = await db
      .collection("customers")
      .doc(userState.info.uid)
      .collection("profiles")
      .where("id", "==", selectedProfile.id)
      .get();

    docRef.forEach((doc) => {
      const profileRef = db
        .collection("customers")
        .doc(userState.info.uid)
        .collection("profiles")
        .doc(doc.id);

      profileRef.delete();
    });

    window.location.reload(true);

    // dispatch(deleteProfile(selectedProfile));
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
        <SaveButton onClick={updateProfile}>Save</SaveButton>
        <TransparentButton onClick={() => setEditProfilePage(false)}>
          Cancel
        </TransparentButton>
        <TransparentButton onClick={deleteProfile}>
          Delete profile
        </TransparentButton>
      </ButtonsContainer>
    </Container>
  );
};
