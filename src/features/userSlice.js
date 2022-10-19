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
  },
});

export const { login, logout, profiles } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
