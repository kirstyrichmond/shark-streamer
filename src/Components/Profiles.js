import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profiles, setSelectedProfile, fetchUserProfiles } from "../features/userSlice";
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
  const user = useSelector(state => state.user.user);
  const [manageProfiles, setManageProfiles] = useState(false);
  const [editProfilePage, setEditProfilePage] = useState(false);

  useEffect(() => {
    if (user?.info?.id) {
      dispatch(fetchUserProfiles(user.info.id));
    }
    setManageProfiles(false);
  }, [dispatch, user?.info?.id]);

  const handlePage = (profile) => {
    dispatch(setSelectedProfile(profile));
    setEditProfilePage(true);
  };

  const setActiveUser = (e, profile) => {
    e.preventDefault();
    dispatch(setSelectedProfile(profile));
    
    if (user?.profiles && Array.isArray(user.profiles)) {
      const updatedProfiles = user.profiles.map(p => ({
        ...p,
        activeProfile: p.id === profile.id
      }));

      dispatch(profiles(updatedProfiles));
      navigate("/")
    }

  };

  return (
    <ProfileContainer>
      {editProfilePage ? (
        <ManageProfile
          setEditProfilePage={(value) => {
            setEditProfilePage(value);
            if (!value) {
              setManageProfiles(false);
            }
          }}
        />
      ) : (
        <>
          <PageTitle>
            {manageProfiles ? "Manage Profiles" : "Who's Watching?"}
          </PageTitle>
          <ProfilesRow>
              {user.profiles.map((profile, index) => (
              <SingleProfileContainer
                key={profile.id || index}
                onClick={(e) => {
                  if (!manageProfiles) {
                    setActiveUser(e, profile);
                  } else {
                    handlePage(profile);
                  }
                }}
              >
                <AvatarContainer
                  $isedit={manageProfiles ? "true" : "false"}
                >
                  {manageProfiles && (
                    <EditProfileIcon
                      src="https://img.icons8.com/sf-regular/48/FFFFFF/edit.png"
                      alt="Edit profile icon"
                    />
                  )}
                  <ProfileAvatar
                    src={profile.avatar_url || "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"}
                    alt="profile avatar"
                    $isedit={manageProfiles ? "true" : "false"}
                  />
                </AvatarContainer>
                <SingleProfileName>{profile.name}</SingleProfileName>
              </SingleProfileContainer>
              )
            )}
          </ProfilesRow>
          <AddProfileContainer onClick={() => navigate("/add-profile")}>
            <AddProfileImage
              src="https://img.icons8.com/ios-glyphs/240/FFFFFF/plus--v1.png"
              alt="add profile"
            />
            <AddProfileText>Add Profile</AddProfileText>
          </AddProfileContainer>
          {user.profiles.length > 0 && (
            <div>
              <ManageProfilesButton
                onClick={() => setManageProfiles(!manageProfiles)}
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
