import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  AddProfileContainer,
  AddProfileHeader,
  AddProfileTitle,
  AvatarImg,
  CancelButton,
  ContinueButton,
  Input,
  InputContainer,
} from "../styles/AddProfileScreen.styles.js";

export const AddProfileScreen = () => {
  const navigate = useNavigate();
  const profileNameRef = useRef(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    const profileName = profileNameRef.current?.value?.trim();
    
    if (!profileName) {
      setError('Profile name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await dispatch(createProfile({
        userId: user.info.id,
        name: profileName,
        avatarUrl: "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229",
        isKids: false
      })).unwrap();
      
      navigate("/profiles");
    } catch (error) {
      setError(error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddProfileContainer>
      <AddProfileHeader>
        <AddProfileTitle>Add Profile</AddProfileTitle>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </AddProfileHeader>
      <InputContainer>
        <AvatarImg
          src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
          alt="new profile avatar"
        />
        <Input 
          ref={profileNameRef} 
          type="text" 
          placeholder="Enter profile name"
          disabled={loading}
        />
      </InputContainer>
      <div>
        <ContinueButton 
          onClick={handleCreateProfile}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Continue'}
        </ContinueButton>
        <CancelButton onClick={() => navigate("/profiles")}>
          Cancel
        </CancelButton>
      </div>
    </AddProfileContainer>
  );
};
