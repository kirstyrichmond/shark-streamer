import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      info: null,
      profiles: [],
    },
  },
  reducers: {
    login: (state, action) => {
      state.user.info = action.payload;
    },
    logout: (state) => {
      state.user.info = null;
    },
    profiles: (state, action) => {
      state.user.profiles.length = 0;

      state.user.profiles.push(...action.payload);
    },
    editProfile: (state, action) => {
      const selectedProfile = action.payload.selectedProfile;
      const newUsername = action.payload.newUsername;

      const profileToUpdate = state.user.profiles.find(
        (profile) => profile.name === selectedProfile.name
      );

      profileToUpdate.name = newUsername;
    },
    // deleteProfile: (state, action) => {
    //   const selectedProfile = action.payload;

    //   state.user.profiles = state.user.profiles.filter(
    //     (profile) => profile.id !== selectedProfile.id
    //   );
    // },
  },
});

export const { login, logout, profiles, editProfile } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
