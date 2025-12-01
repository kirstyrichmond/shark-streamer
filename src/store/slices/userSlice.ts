import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, profileAPI, subscriptionAPI, watchlistAPI } from "../../services/api";
import type { RootState } from "../../app/store";

const handleAsyncError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === "string" ? error : "An unexpected error occurred";
};

export interface User {
  id: string;
  email: string;
  subscription_plan: string;
  profiles?: Profile[];
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  is_kids: boolean;
  activeProfile?: boolean;
}

export interface WatchlistItem {
  id: string;
  movie_id: string;
  title: string;
  name?: string;
  poster_path: string;
  movie_poster?: string;
  movie_title?: string;
  overview: string;
  release_date: string;
  first_air_date?: string;
  added_at: string;
  movie_type: "movie" | "tv";
  media_type?: "movie" | "tv";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

export interface Avatar {
  id: string;
  url: string;
  category: "default" | "kids";
  image_url: string;
  name: string;
}

export interface AsyncState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export interface UserState {
  user: {
    info: User | null;
    profiles: Profile[];
    watchlist: AsyncState<WatchlistItem>;
  };
  selectedProfile: Profile | null;
  plans: AsyncState<Plan>;
  avatars: {
    default: Avatar[];
    kids: Avatar[];
    loading: boolean;
    error: string | null;
  };
  interface: {
    showSignIn: boolean;
    showSignUp: boolean;
    isAnyModalOpen: boolean;
  };
}

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authAPI.login(email, password);
      return result;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authAPI.register(email, password);
      return result;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await authAPI.logout();
  return true;
});

export const getCurrentUser = createAsyncThunk("user/getCurrentUser", async () => {
  const result = await authAPI.getCurrentUser();
  return result;
});

export const fetchUserProfiles = createAsyncThunk<Profile[], string>(
  "user/fetchProfiles",
  async (userId: string, { rejectWithValue }) => {
    try {
      const profiles = await profileAPI.getUserProfiles(userId);
      return profiles;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const createProfile = createAsyncThunk<
  Profile,
  { userId: string; name: string; avatarUrl: string | undefined; isKids: boolean }
>("user/createProfile", async ({ userId, name, avatarUrl, isKids }, { rejectWithValue }) => {
  try {
    const profile = await profileAPI.createProfile(userId, name, avatarUrl, isKids);
    return profile;
  } catch (error) {
    return rejectWithValue(handleAsyncError(error));
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  { profileId: string; updates: Partial<Profile> }
>("user/updateProfile", async ({ profileId, updates }) => {
  const response = (await profileAPI.updateProfile(profileId, updates)) as { profile: Profile };
  return response.profile;
});

export const deleteProfile = createAsyncThunk<string, string>(
  "user/deleteProfile",
  async (profileId: string) => {
    await profileAPI.deleteProfile(profileId);
    return profileId;
  }
);

export const fetchPlans = createAsyncThunk<Plan[], void>(
  "user/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response.plans;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "user/updateSubscription",
  async ({ userId, planId }: { userId: string; planId: string }) => {
    await subscriptionAPI.updateSubscription(userId, planId);
    return planId;
  }
);

export const updateProfileAvatar = createAsyncThunk<
  Profile,
  { profileId: string; avatarData: string }
>("user/updateProfileAvatar", async ({ profileId, avatarData }) => {
  const response = await profileAPI.updateProfileAvatar(profileId, avatarData);
  return response.profile;
});

export const fetchPredefinedAvatars = createAsyncThunk<
  { category: string; avatars: Avatar[] },
  { category?: string }
>("user/fetchPredefinedAvatars", async ({ category = "default" }, { rejectWithValue }) => {
  try {
    const response = await profileAPI.getPredefinedAvatars(category);
    return { category, avatars: response.avatars };
  } catch (error) {
    return rejectWithValue(handleAsyncError(error));
  }
});

export const fetchWatchlist = createAsyncThunk<
  { profileId: string; watchlist: WatchlistItem[] },
  string
>("user/fetchWatchlist", async (profileId: string, { rejectWithValue }) => {
  try {
    const watchlist = await watchlistAPI.getWatchlist(profileId);
    return { profileId, watchlist };
  } catch (error) {
    return rejectWithValue(handleAsyncError(error));
  }
});

export const addToWatchlist = createAsyncThunk<
  { profileId: string; movieId: string; movieData: WatchlistItem },
  { profileId: string; movieId: string; movieData: Omit<WatchlistItem, "id" | "added_at"> }
>("user/addToWatchlist", async ({ profileId, movieId, movieData }, { rejectWithValue }) => {
  try {
    const result = await watchlistAPI.addToWatchlist(profileId, movieId, movieData);
    return { profileId, movieId, movieData: result.item };
  } catch (error) {
    return rejectWithValue(handleAsyncError(error));
  }
});

export const removeFromWatchlist = createAsyncThunk<
  { profileId: string; movieId: string },
  { profileId: string; movieId: string }
>("user/removeFromWatchlist", async ({ profileId, movieId }) => {
  await watchlistAPI.removeFromWatchlist(profileId, movieId);
  return { profileId, movieId };
});

const initialState: UserState = {
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
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    profiles: (state, action: PayloadAction<Profile | Profile[]>) => {
      state.user.profiles = [];

      if (Array.isArray(action.payload)) {
        state.user.profiles = action.payload;
      } else if (action.payload) {
        state.user.profiles.push(action.payload);
      }
    },
    editProfile: (
      state,
      action: PayloadAction<{ selectedProfile: Profile; newUsername: string }>
    ) => {
      const selectedProfile = action.payload.selectedProfile;
      const newUsername = action.payload.newUsername;

      const profileIndex = state.user.profiles.findIndex(
        (profile: Profile) => profile.name === selectedProfile.name
      );

      if (profileIndex !== -1) {
        (state.user.profiles as Profile[])[profileIndex].name = newUsername;
      }
    },
    showSignUp: (state) => {
      if (!state.interface) {
        state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
      }
      state.interface.showSignUp = true;
      state.interface.showSignIn = false;
    },
    showSignIn: (state) => {
      if (!state.interface) {
        state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
      }
      state.interface.showSignIn = true;
      state.interface.showSignUp = false;
    },
    setSelectedProfile: (state, action: PayloadAction<Profile | null>) => {
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
          state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
      })
      .addCase(loginUser.rejected, (_, action) => {
        console.error("Login failed:", action.payload);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user.info = action.payload.user;
        if (action.payload.user.profiles) {
          state.user.profiles = action.payload.user.profiles;
        }
        state.selectedProfile = null;
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
        }
        state.interface.showSignIn = false;
        state.interface.showSignUp = false;
      })
      .addCase(registerUser.rejected, (_, action) => {
        console.error("Registration failed:", action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.info = null;
        state.user.profiles = [];
        if (!state.interface) {
          state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
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
          state.interface = { showSignUp: false, showSignIn: false, isAnyModalOpen: false };
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
        const index = state.user.profiles.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.user.profiles[index] = action.payload;
          if (state.selectedProfile?.id === action.payload.id) {
            state.selectedProfile = action.payload;
          }
        }
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.user.profiles = state.user.profiles.filter((p) => p.id !== action.payload);
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
        state.plans.error = action.error.message || "Failed to fetch plans";
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        if (state.user.info) {
          state.user.info.subscription_plan = action.payload;
        }
      })
      .addCase(updateProfileAvatar.fulfilled, (state, action) => {
        const index = state.user.profiles.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.user.profiles[index] = action.payload;
          if (state.selectedProfile?.id === action.payload.id) {
            state.selectedProfile = action.payload;
          }
        }
      })
      .addCase(fetchPredefinedAvatars.pending, (state) => {
        state.avatars.loading = true;
        state.avatars.error = null;
      })
      .addCase(fetchPredefinedAvatars.fulfilled, (state, action) => {
        state.avatars.loading = false;
        state.avatars.error = null;
        const { category, avatars } = action.payload;
        if (category === "default") {
          state.avatars.default = avatars;
        } else if (category === "kids") {
          state.avatars.kids = avatars;
        }
      })
      .addCase(fetchPredefinedAvatars.rejected, (state, action) => {
        state.avatars.loading = false;
        state.avatars.error = action.error.message || "Failed to fetch avatars";
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
        state.user.watchlist.error = action.error.message || "Failed to fetch watchlist";
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        if (!state.user.watchlist) {
          state.user.watchlist = { items: [], loading: false, error: null };
        }
        const existingIndex = state.user.watchlist.items.findIndex(
          (item) => item.movie_id === action.payload.movieId
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
          (item) => item.movie_id !== action.payload.movieId
        );
      });
  },
});

export const {
  profiles,
  editProfile,
  showSignUp,
  showSignIn,
  setSelectedProfile,
  clearSelectedProfile,
  openModal,
  closeModal,
} = userSlice.actions;

export const selectUserInfo = (state: RootState) => state.user.user.info;
export const selectUserProfiles = (state: RootState) => state.user.user.profiles;
export const selectUser = createSelector(
  [selectUserInfo, selectUserProfiles],
  (userInfo, profiles) => (userInfo ? { ...userInfo, profiles } : null)
);
export const selectPlans = (state: RootState) => state.user.plans;
export const selectSelectedProfile = (state: RootState) => state.user.selectedProfile;
export const selectWatchlist = (state: RootState) =>
  state.user.user?.watchlist || { items: [], loading: false, error: null };
export const selectIsAnyModalOpen = (state: RootState) =>
  state.user.interface?.isAnyModalOpen || false;
export const selectWatchlistItems = (state: RootState) => state.user.user.watchlist?.items || [];
export const selectWatchlistLoading = (state: RootState) =>
  state.user.user.watchlist?.loading ?? true;
export const selectWatchlistError = (state: RootState) => state.user.user.watchlist?.error || null;

export const selectAvatars = createSelector(
  [(state: RootState) => state.user.avatars],
  (avatars) => avatars
);

export const selectSortedWatchlistItems = createSelector(
  [selectWatchlistItems],
  (items: WatchlistItem[]) => {
    if (!items.length) return [];
    return [...items].sort((a, b) => {
      const dateComparison = new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      return dateComparison !== 0 ? dateComparison : parseInt(b.id) - parseInt(a.id);
    });
  }
);

export default userSlice.reducer;
