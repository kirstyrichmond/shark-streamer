import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { updateProfile, deleteProfile, updateProfileAvatar, createProfile, selectUser, selectSelectedProfile, clearSelectedProfile, fetchUserProfiles } from "../store/slices/userSlice";
import {
  ButtonsContainer,
  Container,
  MiddleContainer,
  NameInput,
  PageTitle,
  SaveButton,
  TransparentButton,
  CheckboxContainer,
  CheckboxLabel,
  AvatarLoadingOverlay,
  HiddenFileInput,
  AvatarPlaceholder,
  PrimaryButtonGroup,
  AvatarPlaceholderText,
} from "../styles/ManageProfile.styles";
import { AvatarContainer, EditProfileIcon, ProfileAvatar } from "../styles/Profiles.styles";
import { AvatarPicker } from "./AvatarPicker";
import { useAppDispatch } from "../app/store";

interface ManageProfileProps {
  setEditProfilePage: (value: boolean) => void;
  isCreating?: boolean;
  isFirstProfile?: boolean;
}

export const ManageProfile: React.FC<ManageProfileProps> = ({
  setEditProfilePage,
  isCreating = false,
  isFirstProfile = false,
}) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const selectedProfile = useSelector(selectSelectedProfile);
  const newUsername = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isKids, setIsKids] = useState(isCreating ? false : selectedProfile?.is_kids || false);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    isCreating ? null :
    selectedProfile?.avatar_url ||
    "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
  );

  interface SaveProfileProps {
    userId: string;
    name: string;
    avatarUrl: string | undefined;
    isKids: boolean;
  }

  interface UpdateProfileProps {
    profileId: string;
    updates: {
      name: string;
      is_kids: boolean;
    };
  }

  interface UpdateProfileAvatarProps {
    profileId: string;
    avatarData: string;
  }

  const handleSaveProfile = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const profileName = newUsername.current?.value?.trim();
    if (!profileName) {
      alert('Profile name is required');
      return;
    }

    if (isCreating && !avatarPreview) {
      alert('Please select an avatar');
      return;
    }

    try {
      if (isCreating) {
        const newProfile: SaveProfileProps = {
          userId: user?.id || '',
          name: profileName,
          avatarUrl: avatarPreview || undefined,
          isKids: isKids,
        };
        await dispatch(createProfile(newProfile)).unwrap();

        if (user?.id) {
          await dispatch(fetchUserProfiles(user.id));
        }
      } else {
        const profileUpdates: UpdateProfileProps = {
          profileId: selectedProfile?.id || '',
          updates: {
            name: profileName,
            is_kids: isKids,
          },
        };
        await dispatch(updateProfile(profileUpdates)).unwrap();

        if (avatarPreview && avatarPreview !== selectedProfile?.avatar_url) {
          const avatarUpdate: UpdateProfileAvatarProps = {
            profileId: selectedProfile?.id || '',
            avatarData: avatarPreview,
          };
          await dispatch(updateProfileAvatar(avatarUpdate)).unwrap();
        }
      }

      setEditProfilePage(false);
    } catch (error) {
      alert('Error saving profile. Please try again.');
    }
  };

  interface AvatarChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
      files: FileList | null;
    };
  }

  const handleAvatarChange = async (event: AvatarChangeEvent): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setAvatarLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Data = e.target?.result as string | null;
        setAvatarPreview(base64Data);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error processing image');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      if (selectedProfile) {
        await dispatch(deleteProfile(selectedProfile.id)).unwrap();
      }
      dispatch(clearSelectedProfile());
      setEditProfilePage(false);
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <Container>
      <div style={{ width: '100%'}}>
        <PageTitle>{isCreating ? 'Add' : 'Edit'} Profile</PageTitle>
      </div>
      <MiddleContainer>
        <AvatarContainer 
          onClick={() => setShowAvatarPicker(true)}
          $isedit="true"
        >
          {avatarPreview ? (
            <ProfileAvatar
              src={avatarPreview}
              alt="profile"
            />
          ) : (
            <AvatarPlaceholder>
              <AvatarPlaceholderText>Click to <br/> Select Avatar</AvatarPlaceholderText>
            </AvatarPlaceholder>
          )}
          {avatarLoading && (
            <AvatarLoadingOverlay>
              Uploading...
            </AvatarLoadingOverlay>
          )}
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatarPreview && (
            <EditProfileIcon
            src="https://img.icons8.com/sf-regular/48/FFFFFF/edit.png"
            alt="Edit profile icon"
            />
          )}
        </AvatarContainer>
        <NameInput 
          type="text" 
          ref={newUsername} 
          defaultValue={isCreating ? '' : selectedProfile?.name || ''}
          placeholder="Profile name"
        />
      </MiddleContainer>
      <CheckboxContainer>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={isKids}
            onChange={(e) => setIsKids(e.target.checked)}
          />
          Kids Profile
        </CheckboxLabel>
      </CheckboxContainer>
      <ButtonsContainer>
        <PrimaryButtonGroup>
          <SaveButton onClick={handleSaveProfile}>
            {isCreating ? 'Create' : 'Save'}
          </SaveButton>
          {(!isCreating || (isCreating && !isFirstProfile)) && (
            <TransparentButton onClick={() => setEditProfilePage(false)}>
              Cancel
            </TransparentButton>
          )}
        </PrimaryButtonGroup>
        {!isCreating && user?.profiles?.length > 1 && (
          <TransparentButton onClick={handleDeleteProfile}>
            Delete profile
          </TransparentButton>
        )}
      </ButtonsContainer>
      <AvatarPicker
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        currentAvatar={avatarPreview || undefined}
        onAvatarUpdate={(newAvatar) => setAvatarPreview(newAvatar)}
      />
    </Container>
  );
};
