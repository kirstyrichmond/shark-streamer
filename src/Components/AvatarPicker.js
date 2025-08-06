import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPredefinedAvatars, selectAvatars } from '../features/userSlice';
import {
  AvatarPickerOverlay,
  AvatarPickerModal,
  AvatarPickerHeader,
  AvatarPickerTitle,
  AvatarPickerClose,
  AvatarPickerContent,
  AvatarGrid,
  AvatarOption,
  AvatarImage,
  CategoryTabs,
  CategoryTab,
  UploadSection,
  UploadButton,
  HiddenFileInput,
  LoadingText
} from '../styles/AvatarPicker.styles';

export const AvatarPicker = ({ 
  isOpen, 
  onClose, 
  currentAvatar, 
  onAvatarUpdate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const avatarsState = useSelector(selectAvatars);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPredefinedAvatars(selectedCategory));
    }
  }, [isOpen, selectedCategory, dispatch]);

  const handleAvatarSelect = (avatarUrl) => {
    onAvatarUpdate?.(avatarUrl);
    onClose();
  };

  const handleCustomUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        onAvatarUpdate?.(base64Data);
        onClose();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error processing image');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AvatarPickerOverlay onClick={onClose}>
      <AvatarPickerModal onClick={(e) => e.stopPropagation()}>
        <AvatarPickerHeader>
          <AvatarPickerTitle>Choose Avatar</AvatarPickerTitle>
          <AvatarPickerClose onClick={onClose}>×</AvatarPickerClose>
        </AvatarPickerHeader>
        <AvatarPickerContent>
          <CategoryTabs>
            <CategoryTab 
              $active={selectedCategory === 'default'} 
              onClick={() => setSelectedCategory('default')}
            >
              Default
            </CategoryTab>
            <CategoryTab 
              $active={selectedCategory === 'kids'} 
              onClick={() => setSelectedCategory('kids')}
            >
              Kids
            </CategoryTab>
          </CategoryTabs>
          {avatarsState.loading ? (
            <LoadingText>Loading avatars...</LoadingText>
          ) : (
            <AvatarGrid>
              {(avatarsState[selectedCategory] || []).map((avatar) => (
                <AvatarOption 
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.image_url)}
                  $selected={currentAvatar === avatar.image_url}
                >
                  <AvatarImage 
                    src={avatar.image_url} 
                    alt={avatar.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </AvatarOption>
              ))}
            </AvatarGrid>
          )}
          <UploadSection>
            <UploadButton 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Custom Image'}
            </UploadButton>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomUpload}
            />
          </UploadSection>
        </AvatarPickerContent>
      </AvatarPickerModal>
    </AvatarPickerOverlay>
  );
};