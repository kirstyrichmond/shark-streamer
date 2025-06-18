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
      // Clear the profiles array
      state.user.profiles = [];
      
      // Check if action.payload is an array before spreading
      if (Array.isArray(action.payload)) {
        // Add new profiles using concat instead of push with spread
        state.user.profiles = state.user.profiles.concat(action.payload);
      } else if (action.payload) {
        // If it's a single profile object, add it directly
        state.user.profiles.push(action.payload);
      }
    },
    editProfile: (state, action) => {
      const selectedProfile = action.payload.selectedProfile;
      const newUsername = action.payload.newUsername;

      // Find the profile safely
      const profileIndex = state.user.profiles.findIndex(
        (profile) => profile.name === selectedProfile.name
      );
      
      // Only update if profile exists
      if (profileIndex !== -1) {
        state.user.profiles[profileIndex].name = newUsername;
      }
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