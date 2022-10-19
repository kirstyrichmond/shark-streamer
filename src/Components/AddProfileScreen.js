import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { profiles, selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  AddProfileContainer,
  AddProfileHeader,
  AddProfileTitle,
  AvatarImg,
  CancelButton,
  ContinueButton,
  Description,
  Input,
  InputContainer,
} from "../styles/AddProfileScreen.styles.js";
import db from "../firebase.js";

export const AddProfileScreen = () => {
  const navigate = useNavigate();
  const profileNameRef = useRef(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const uniqueId = (Math.random() + 1).toString(36).substring(2);

  const createProfile = async (e) => {
    e.preventDefault();

    const docRef = await db
      .collection("customers")
      .doc(user.info.uid)
      .collection("profiles")
      .add({
        id: uniqueId,
        name: profileNameRef.current.value,
        activeProfile: false,
      });

    docRef.onSnapshot(async (snap) => {
      const data = snap.data();

      dispatch(
        profiles({
          profile: [data],
        })
      );
    });

    navigate("/profiles");

    return docRef;
  };

  return (
    <AddProfileContainer>
      <AddProfileHeader>
        <AddProfileTitle>Add Profile</AddProfileTitle>
        <Description>
          Add a profile for another person watching Netflix.
        </Description>
      </AddProfileHeader>
      <InputContainer>
        <AvatarImg
          src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
          alt="new profile avatar"
        />
        <Input ref={profileNameRef} type="text" />
      </InputContainer>
      <div>
        <ContinueButton onClick={(e) => createProfile(e)}>
          Continue
        </ContinueButton>
        <CancelButton onClick={() => navigate("/profiles")}>
          Cancel
        </CancelButton>
      </div>
    </AddProfileContainer>
  );
};
