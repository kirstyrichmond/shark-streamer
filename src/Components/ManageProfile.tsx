import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateProfile,
  deleteProfile,
  updateProfileAvatar,
  createProfile,
  selectUser,
  selectEditingProfile,
  clearEditingProfile,
  fetchUserProfiles,
} from "../store/slices/userSlice";
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
  NameContainer,
} from "../styles/ManageProfile.styles";
import { AvatarContainer, EditProfileIcon, ProfileAvatar } from "../styles/Profiles.styles";
import { AvatarPicker } from "./AvatarPicker";
import { useAppDispatch } from "../app/store";
import { useForm } from "react-hook-form";

interface ManageProfileProps {
  setEditProfilePage: (value: boolean) => void;
  isCreating?: boolean;
  isFirstProfile?: boolean;
}

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

export const ManageProfile: React.FC<ManageProfileProps> = ({
  setEditProfilePage,
  isCreating = false,
  isFirstProfile = false,
}) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const editingProfile = useSelector(selectEditingProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isKids, setIsKids] = useState(isCreating ? false : editingProfile?.is_kids || false);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    isCreating
      ? null
      : editingProfile?.avatar_url ||
          "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
  );

  const schema = yup.object({
    name: yup.string().required("Profile name is required").max(30, "Name is too long"),
    avatar: yup
      .string()
      .nullable()
      .when([], {
        is: () => isCreating,
        then: (schema) => schema.required("Avatar is required"),
        otherwise: (schema) => schema.nullable(),
      }),
  });
  const defaultValues = {
    name: isCreating ? "" : editingProfile?.name || "",
    avatar: avatarPreview,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleSaveProfile = async (data: { name?: string; avatar?: string }) => {
    const profileName = data.name?.trim();

    try {
      if (isCreating) {
        const newProfile: SaveProfileProps = {
          userId: user?.id || "",
          name: profileName,
          avatarUrl: data.avatar,
          isKids: isKids,
        };
        await dispatch(createProfile(newProfile)).unwrap();

        if (user?.id) {
          await dispatch(fetchUserProfiles(user.id));
        }
      } else {
        const profileUpdates: UpdateProfileProps = {
          profileId: editingProfile?.id || "",
          updates: {
            name: profileName,
            is_kids: isKids,
          },
        };
        await dispatch(updateProfile(profileUpdates)).unwrap();

        if (avatarPreview && avatarPreview !== editingProfile?.avatar_url) {
          const avatarUpdate: UpdateProfileAvatarProps = {
            profileId: editingProfile?.id || "",
            avatarData: avatarPreview,
          };
          await dispatch(updateProfileAvatar(avatarUpdate)).unwrap();
        }
      }

      setEditProfilePage(false);
    } catch {
      alert("Error saving profile. Please try again.");
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

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setAvatarLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Data = e.target?.result as string | null;
        setAvatarPreview(base64Data);
        setValue("avatar", base64Data);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("Error processing image");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      if (editingProfile) {
        await dispatch(deleteProfile(editingProfile.id)).unwrap();
      }
      dispatch(clearEditingProfile());
      setEditProfilePage(false);
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <Container>
      <form onSubmit={ handleSubmit(handleSaveProfile) }>
        <div style={ { width: "100%" } }>
          <PageTitle>{ isCreating ? "Add" : "Edit" } Profile</PageTitle>
        </div>
        <MiddleContainer>
          <AvatarContainer onClick={ () => setShowAvatarPicker(true) } $isedit="true">
            { avatarPreview ? (
              <ProfileAvatar src={ avatarPreview } alt="profile" />
            ) : (
              <AvatarPlaceholder hasError={ !!errors.avatar }>
                <AvatarPlaceholderText hasError={ !!errors.avatar }>
                  { errors.avatar ? (
                    "Avatar is required"
                  ) : (
                    <>
                      Click to
                      <br />
                      select avatar
                    </>
                  ) }
                </AvatarPlaceholderText>
              </AvatarPlaceholder>
            ) }
            { avatarLoading && <AvatarLoadingOverlay>Uploading...</AvatarLoadingOverlay> }
            <HiddenFileInput ref={ fileInputRef } type="file" accept="image/*" onChange={ handleAvatarChange } />
            { avatarPreview && (
              <EditProfileIcon src="https://img.icons8.com/sf-regular/48/FFFFFF/edit.png" alt="Edit profile icon" />
            ) }
          </AvatarContainer>
          <NameContainer>
            <NameInput type="text" { ...register("name") } placeholder="Profile name" />
            <input type="hidden" { ...register("avatar") } />
            { errors.name && <p style={ { color: "#FF3131", marginTop: "12px" } }>{ errors.name.message }</p> }
          </NameContainer>
        </MiddleContainer>
        <CheckboxContainer>
          <CheckboxLabel>
            <input type="checkbox" checked={ isKids } onChange={ (e) => setIsKids(e.target.checked) } />
            Kids Profile
          </CheckboxLabel>
        </CheckboxContainer>
        <ButtonsContainer>
          <PrimaryButtonGroup>
            <SaveButton type="submit">{ isCreating ? "Create" : "Save" }</SaveButton>
            { (!isCreating || (isCreating && !isFirstProfile)) && (
              <TransparentButton onClick={ () => setEditProfilePage(false) }>Cancel</TransparentButton>
            ) }
          </PrimaryButtonGroup>
          { !isCreating && user?.profiles?.length > 1 && (
            <TransparentButton onClick={ handleDeleteProfile }>Delete profile</TransparentButton>
          ) }
        </ButtonsContainer>
        <AvatarPicker
          isOpen={ showAvatarPicker }
          onClose={ () => setShowAvatarPicker(false) }
          currentAvatar={ avatarPreview || undefined }
          onAvatarUpdate={ (newAvatar) => {
            setAvatarPreview(newAvatar);
            setValue("avatar", newAvatar);
          } }
        />
      </form>
    </Container>
  );
};
