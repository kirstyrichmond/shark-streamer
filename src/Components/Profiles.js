import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { profiles } from "../features/userSlice";
import {
  AddProfileContainer,
  AddProfileImage,
  AddProfileText,
  AvatarContainer,
  EditProfileIcon,
  ManageProfilesButton,
  PageTitle,
  ProfileAvatar,
  ProfileContainer,
  ProfilesRow,
  SingleProfileContainer,
  SingleProfileName,
} from "../styles/Profiles.styles";
import { ManageProfile } from "./ManageProfile";

export const Profiles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usersState = useSelector(profiles);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [manageProfiles, setManageProfiles] = useState(false);
  const [editProfilePage, setEditProfilePage] = useState(false);

  useEffect(() => {
    db.collection("customers")
      .doc(usersState.payload.user.user.info.uid)
      .collection("profiles")
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => doc.data());

        !usersState.payload.user.user.profiles.includes((arr) =>
          documents.every(arr)
        ) && dispatch(profiles(documents));
      });
  }, []);

  const handlePage = (profile) => {
    setSelectedProfile(profile);
    setEditProfilePage(true);
  };

  const setActiveUser = (e, profile) => {
    setSelectedProfile(profile);
    const arrayCopy = [...usersState.payload.user.user.profiles];
    e.preventDefault();

    const newArr = arrayCopy.map((profile) => {
      return (profile = {
        ...profile,
        activeProfile: false,
      });
    });

    let selectedProfileIndex = newArr.findIndex((profile) => {
      return profile.id === selectedProfile.id;
    });

    newArr[selectedProfileIndex] = {
      ...selectedProfile,
      activeProfile: true,
    };

    dispatch(profiles(newArr));
  };

  return (
    <ProfileContainer>
      {editProfilePage ? (
        <ManageProfile
          setEditProfilePage={setEditProfilePage}
          profileName={selectedProfile.name}
        />
      ) : (
        <>
          <PageTitle>
            {manageProfiles ? "Manage Profiles" : "Who's Watching?"}
          </PageTitle>
          <ProfilesRow>
            {usersState.payload.user.user.profiles.map((profile) => {
              return (
                <SingleProfileContainer
                  onClick={(e) => {
                    if (!manageProfiles) {
                      setActiveUser(e, profile);
                    }

                    manageProfiles && handlePage(profile);
                  }}
                >
                  <AvatarContainer>
                    {manageProfiles && (
                      <EditProfileIcon
                        src="https://img.icons8.com/sf-regular/48/FFFFFF/edit.png"
                        alt=""
                        edit={manageProfiles}
                      />
                    )}
                    <ProfileAvatar
                      src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
                      alt="profile avatar"
                    />
                  </AvatarContainer>
                  <SingleProfileName>{profile.name}</SingleProfileName>
                </SingleProfileContainer>
              );
            })}
          </ProfilesRow>
          <AddProfileContainer onClick={() => navigate("/add-profile")}>
            <AddProfileImage
              src="https://img.icons8.com/ios-glyphs/240/FFFFFF/plus--v1.png"
              alt="add profile"
            />
            <AddProfileText>Add Profile</AddProfileText>
          </AddProfileContainer>
          {usersState.payload.user.user.profiles.length && (
            <div>
              <ManageProfilesButton
                onClick={() =>
                  manageProfiles
                    ? setManageProfiles(false)
                    : setManageProfiles(true)
                }
              >
                {manageProfiles ? "Done" : "Manage Profiles"}
              </ManageProfilesButton>
            </div>
          )}
        </>
      )}
    </ProfileContainer>
  );
};
