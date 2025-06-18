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
  const user = useSelector(state => state.user.user);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [manageProfiles, setManageProfiles] = useState(false);
  const [editProfilePage, setEditProfilePage] = useState(false);

  useEffect(() => {
    // Make sure user.info exists before trying to access it
    if (user?.info?.uid) {
      db.collection("customers")
        .doc(user.info.uid)
        .collection("profiles")
        .get()
        .then((querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => doc.data());
          
          // Check if we need to update profiles
          if (documents.length > 0) {
            // Dispatch documents directly - the reducer will handle it
            dispatch(profiles(documents));
          }
        })
        .catch(error => {
          console.error("Error fetching profiles:", error);
        });
    }
  }, [dispatch, user?.info?.uid]);

  const handlePage = (profile) => {
    setSelectedProfile(profile);
    setEditProfilePage(true);
  };

  const setActiveUser = (e, profile) => {
    e.preventDefault();
    setSelectedProfile(profile);
    
    // Make sure profiles exist before attempting to map
    if (user?.profiles && Array.isArray(user.profiles)) {
      // Create a new array of profiles with updated active status
      const updatedProfiles = user.profiles.map(p => ({
        ...p,
        activeProfile: p.id === profile.id
      }));

      // Dispatch the updated array of profiles
      dispatch(profiles(updatedProfiles));
      navigate("/")
    }

  };

  // Ensure profiles exist and are an array before rendering
  const userProfiles = user?.profiles || [];

  return (
    <ProfileContainer>
      {editProfilePage ? (
        <ManageProfile
          setEditProfilePage={setEditProfilePage}
          profileName={selectedProfile.name}
          selectedProfile={selectedProfile}
        />
      ) : (
        <>
          <PageTitle>
            {manageProfiles ? "Manage Profiles" : "Who's Watching?"}
          </PageTitle>
          <ProfilesRow>
            {userProfiles.map((profile, index) => (
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
                <AvatarContainer>
                  {manageProfiles && (
                    <EditProfileIcon
                      src="https://img.icons8.com/sf-regular/48/FFFFFF/edit.png"
                      alt="Edit profile icon"
                      $isedit={manageProfiles ? "true" : "false"}
                    />
                  )}
                  <ProfileAvatar
                    src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
                    alt="profile avatar"
                  />
                </AvatarContainer>
                <SingleProfileName>{profile.name}</SingleProfileName>
              </SingleProfileContainer>
            ))}
          </ProfilesRow>
          <AddProfileContainer onClick={() => navigate("/add-profile")}>
            <AddProfileImage
              src="https://img.icons8.com/ios-glyphs/240/FFFFFF/plus--v1.png"
              alt="add profile"
            />
            <AddProfileText>Add Profile</AddProfileText>
          </AddProfileContainer>
          {userProfiles.length > 0 && (
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
