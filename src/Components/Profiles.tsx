import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { profiles, setSelectedProfile, fetchUserProfiles, selectUser, Profile } from "../store/slices/userSlice";
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
import { RoutePaths } from "../router/types";
import { useAppDispatch } from "../app/store";

export const Profiles = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [manageProfiles, setManageProfiles] = useState(false);
  const [editProfilePage, setEditProfilePage] = useState(false);
  const [addProfilePage, setAddProfilePage] = useState(false);
  const isFirstProfile = !user?.profiles || user.profiles.length === 0;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfiles(user.id));
    }
    setManageProfiles(false);
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (isFirstProfile && user?.id) {
      setAddProfilePage(true);
    }
  }, [isFirstProfile, user?.id]);

  const handlePage = (profile: Profile) => {
    dispatch(setSelectedProfile(profile));
    setEditProfilePage(true);
  };

  const setActiveUser = (e: React.MouseEvent, profile: Profile) => {
    e.preventDefault();
    dispatch(setSelectedProfile(profile));
    
    if (user?.profiles && Array.isArray(user.profiles)) {
      const updatedProfiles = user.profiles.map(p => ({
        ...p,
        activeProfile: p.id === profile.id
      }));

      dispatch(profiles(updatedProfiles));
      navigate(RoutePaths.Home)
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
      ) : addProfilePage ? (
        <ManageProfile
          isCreating={true}
          isFirstProfile={isFirstProfile}
          setEditProfilePage={(value) => {
            setAddProfilePage(value);
            if (!value && isFirstProfile) {
              navigate(RoutePaths.Home);
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
                  />
                </AvatarContainer>
                <SingleProfileName>{profile.name}</SingleProfileName>
              </SingleProfileContainer>
              )
            )}
          </ProfilesRow>
          {!manageProfiles && (
            <AddProfileContainer onClick={() => setAddProfilePage(true)}>
              <AddProfileImage
                src="https://img.icons8.com/ios-glyphs/240/FFFFFF/plus--v1.png"
                alt="add profile"
              />
              <AddProfileText>Add Profile</AddProfileText>
            </AddProfileContainer>
          )}
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
