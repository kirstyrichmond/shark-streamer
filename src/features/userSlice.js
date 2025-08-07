import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { authAPI, profileAPI, subscriptionAPI } from "../services/api";

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authAPI.login(email, password);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authAPI.register(email, password);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      return true;
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authAPI.getCurrentUser();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfiles = createAsyncThunk(
  'user/fetchProfiles',
  async (userId, { rejectWithValue }) => {
    try {
      const profiles = await profileAPI.getUserProfiles(userId);
      return profiles;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProfile = createAsyncThunk(
  'user/createProfile',
  async ({ userId, name, avatarUrl, isKids }, { rejectWithValue }) => {
    try {
      const profile = await profileAPI.createProfile(userId, name, avatarUrl, isKids);
      return profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ profileId, updates }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(profileId, updates);
      return response.profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'user/deleteProfile',
  async (profileId, { rejectWithValue }) => {
    try {
      await profileAPI.deleteProfile(profileId);
      return profileId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlans = createAsyncThunk(
  'user/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response.plans;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'user/updateSubscription',
  async ({ userId, planId }, { rejectWithValue }) => {
    try {
      await subscriptionAPI.updateSubscription(userId, planId);
      return planId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileAvatar = createAsyncThunk(
  'user/updateProfileAvatar',
  async ({ profileId, avatarData }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfileAvatar(profileId, avatarData);
      return response.profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPredefinedAvatars = createAsyncThunk(
  'user/fetchPredefinedAvatars',
  async (category = 'default', { rejectWithValue }) => {
    try {
      const response = await profileAPI.getPredefinedAvatars(category);
      return { category, avatars: response.avatars };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      info: null,
      profiles: [],
    },
    selectedProfile: null,
    plans: {
      items: [],
      loading: false,
      error: null,
    },
    avatars: {
      default: [],
      kids: [],
      loading: false,
      error: null,
    },
    ui: {
      showSignIn: false,
      showSignUp: false,
    },
  },
  reducers: {
    profiles: (state, action) => {
      state.user.profiles = [];
      
      if (Array.isArray(action.payload)) {
        state.user.profiles = state.user.profiles.concat(action.payload);
      } else if (action.payload) {
        state.user.profiles.push(action.payload);
      }
    },
    editProfile: (state, action) => {
      const selectedProfile = action.payload.selectedProfile;
      const newUsername = action.payload.newUsername;

      const profileIndex = state.user.profiles.findIndex(
        (profile) => profile.name === selectedProfile.name
      );
      
      if (profileIndex !== -1) {
        state.user.profiles[profileIndex].name = newUsername;
      }
    },
    showSignUp: (state) => {
      console.log('showSignUp reducer - before:', state.ui);
      if (!state.ui) {
        state.ui = { showSignUp: false, showSignIn: false };
      }
      state.ui.showSignUp = true;
      state.ui.showSignIn = false;
      console.log('showSignUp reducer - after:', state.ui);
    },
    showSignIn: (state) => {
      if (!state.ui) {
        state.ui = { showSignUp: false, showSignIn: false };
      }
      state.ui.showSignIn = true;
      state.ui.showSignUp = false;
    },
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.info = action.payload.user;
        if (action.payload.user.profiles) {
          state.user.profiles = action.payload.user.profiles;
        }
        state.ui?.showSignIn = false;
        state.ui?.showSignUp = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('Login failed:', action.payload);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user.info = action.payload.user;
        if (action.payload.user.profiles) {
          state.user.profiles = action.payload.user.profiles;
        }
        state.selectedProfile = null;
        state.ui?.showSignIn = false;
        state.ui?.showSignUp = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error('Registration failed:', action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.info = null;
        state.user.profiles = [];
        state.ui?.showSignIn = false;
        state.ui?.showSignUp = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user.info = action.payload.user;
        if (action.payload.user.profiles) {
          state.user.profiles = action.payload.user.profiles;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user.info = null;
        state.user.profiles = [];
        state.ui?.showSignIn = false;
        state.ui?.showSignUp = false;
      })
      .addCase(fetchUserProfiles.fulfilled, (state, action) => {
        state.user.profiles = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.user.profiles.push(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.user.profiles.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.user.profiles[index] = action.payload;
          if (state.selectedProfile?.id === action.payload.id) {
            state.selectedProfile = action.payload;
          }
        }
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.user.profiles = state.user.profiles.filter(p => p.id !== action.payload);
      })
      .addCase(fetchPlans.pending, (state) => {
        state.plans.loading = true;
        state.plans.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans.loading = false;
        state.plans.items = action.payload;
        state.plans.error = null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.plans.loading = false;
        state.plans.error = action.payload;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        if (state.user.info) {
          state.user.info.subscription_plan = action.payload;
        }
      })
      .addCase(updateProfileAvatar.fulfilled, (state, action) => {
        const index = state.user.profiles.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.user.profiles[index] = action.payload;
          if (state.selectedProfile?.id === action.payload.id) {
            state.selectedProfile = action.payload;
          }
        }
      })
      .addCase(fetchPredefinedAvatars.pending, (state) => {
        if (!state.avatars) {
          state.avatars = { default: [], kids: [], loading: false, error: null };
        }
        state.avatars.loading = true;
        state.avatars.error = null;
      })
      .addCase(fetchPredefinedAvatars.fulfilled, (state, action) => {
        if (!state.avatars) {
          state.avatars = { default: [], kids: [], loading: false, error: null };
        }
        state.avatars.loading = false;
        state.avatars.error = null;
        const { category, avatars } = action.payload;
        state.avatars[category] = avatars;
      })
      .addCase(fetchPredefinedAvatars.rejected, (state, action) => {
        if (!state.avatars) {
          state.avatars = { default: [], kids: [], loading: false, error: null };
        }
        state.avatars.loading = false;
        state.avatars.error = action.payload;
      });
  },
});

export const { profiles, editProfile, showSignUp, showSignIn, setSelectedProfile, clearSelectedProfile } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectPlans = (state) => state.user.plans;
export const selectSelectedProfile = (state) => state.user.selectedProfile;

export const selectAvatars = createSelector(
  [(state) => state.user],
  (userState) => userState?.avatars || { default: [], kids: [], loading: false, error: null }
);

export default userSlice.reducer;