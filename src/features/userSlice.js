import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { authAPI, profileAPI, subscriptionAPI, watchlistAPI } from "../services/api";

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

export const fetchWatchlist = createAsyncThunk(
  'user/fetchWatchlist',
  async (profileId, { rejectWithValue }) => {
    try {
      const watchlist = await watchlistAPI.getWatchlist(profileId);
      return { profileId, watchlist };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'user/addToWatchlist',
  async ({ profileId, movieId, movieData }, { rejectWithValue }) => {
    try {
      const result = await watchlistAPI.addToWatchlist(profileId, movieId, movieData);
      return { profileId, movieId, movieData: result.item };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'user/removeFromWatchlist',
  async ({ profileId, movieId }, { rejectWithValue }) => {
    try {
      await watchlistAPI.removeFromWatchlist(profileId, movieId);
      return { profileId, movieId };
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
      watchlist: {
        items: [],
        loading: false,
        error: null,
      },
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
    interface: {
      showSignIn: false,
      showSignUp: false,
      isAnyModalOpen: false,
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
      if (!state.interface) {
        state.interface = { showSignUp: false, showSignIn: false };
      }
      state.interface.showSignUp = true;
      state.interface.showSignIn = false;
    },
    showSignIn: (state) => {
      if (!state.interface) {
        state.interface = { showSignUp: false, showSignIn: false };
      }
      state.interface.showSignIn = true;
      state.interface.showSignUp = false;
    },
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
    },
    openModal: (state) => {
      state.interface.isAnyModalOpen = true;
    },
    closeModal: (state) => {
      state.interface.isAnyModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.info = action.payload.user;
        if (action.payload.user.profiles) {
          state.user.profiles = action.payload.user.profiles;
        }
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
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
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error('Registration failed:', action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.info = null;
        state.user.profiles = [];
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
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
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
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
      })
      .addCase(fetchWatchlist.pending, (state) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        state.user.watchlist.loading = true;
        state.user.watchlist.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        state.user.watchlist.loading = false;
        state.user.watchlist.items = action.payload.watchlist;
        state.user.watchlist.error = null;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        state.user.watchlist.loading = false;
        state.user.watchlist.error = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        const existingIndex = state.user.watchlist.items.findIndex(
          item => item.movie_id === action.payload.movieId
        );
        if (existingIndex === -1) {
          state.user.watchlist.items.push(action.payload.movieData);
        }
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        state.user.watchlist.items = state.user.watchlist.items.filter(
          item => item.movie_id !== action.payload.movieId
        );
      });
  },
});

export const { profiles, editProfile, showSignUp, showSignIn, setSelectedProfile, clearSelectedProfile, openModal, closeModal } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectPlans = (state) => state.user.plans;
export const selectSelectedProfile = (state) => state.user.selectedProfile;
export const selectWatchlist = (state) => state.user.user?.watchlist || { items: [], loading: false, error: null };
export const selectIsAnyModalOpen = (state) => state.user.interface?.isAnyModalOpen || false;
export const selectWatchlistItems = (state) => state.user.user?.watchlist?.items || [];
export const selectWatchlistLoading = (state) => state.user.user?.watchlist?.loading ?? true;
export const selectWatchlistError = (state) => state.user.user?.watchlist?.error || null;

export const selectAvatars = createSelector(
  [(state) => state.user],
  (userState) => userState?.avatars || { default: [], kids: [], loading: false, error: null }
);

export const selectSortedWatchlistItems = createSelector(
  [selectWatchlistItems],
  (items) => {
    if (!items.length) return [];
    return [...items].sort((a, b) => {
      const dateComparison = new Date(b.added_at) - new Date(a.added_at);
      return dateComparison !== 0 ? dateComparison : b.id - a.id;
    });
  }
);

export default userSlice.reducer;