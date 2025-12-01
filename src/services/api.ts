import axios from "axios";
import { Profile, WatchlistItem, User, Plan, Avatar } from "../store/slices/userSlice";

interface AuthResponse {
  access_token: string;
  user: User;
}

interface ProfileResponse {
  profile: Profile;
}

interface PlansResponse {
  plans: Plan[];
}

interface AvatarsResponse {
  avatars: Avatar[];
}

interface WatchlistItemResponse {
  item: WatchlistItem;
}

export const getApiUrl = () => {
  console.log("Environment variables:", import.meta.env);
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

  if (import.meta.env.VITE_API_BASE_URL) {
    const envUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
    return envUrl;
  }

  const hostname = window.location.hostname;

  if (hostname.includes("render.com") || hostname.includes("onrender.com")) {
    const prodUrl = "https://shark-streamer-dcjp.onrender.com/api";
    return prodUrl;
  } else {
    const devUrl = "http://localhost:5001/api";
    return devUrl;
  }
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shark_streamer_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleRequest = async <T>(
  requestFn: () => Promise<{ data: T }>,
  errorMessage: string
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || errorMessage);
    }
    throw new Error(errorMessage);
  }
};

export const authAPI = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await handleRequest<AuthResponse>(
      () => api.post("/auth/register", { email, password }),
      "Registration failed"
    );
    if (data.access_token) {
      localStorage.setItem("shark_streamer_token", data.access_token);
    }
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await handleRequest<AuthResponse>(
      () => api.post("/auth/login", { email, password }),
      "Login failed...."
    );
    if (data.access_token) {
      localStorage.setItem("shark_streamer_token", data.access_token);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("shark_streamer_token");
    }
    return { message: "Logout successful" };
  },

  getCurrentUser: (): Promise<AuthResponse> =>
    handleRequest<AuthResponse>(() => api.get("/auth/me"), "Failed to get user"),
};

export const profileAPI = {
  getUserProfiles: (userId: string): Promise<Profile[]> =>
    handleRequest<Profile[]>(() => api.get(`/profiles/user/${userId}`), "Failed to get profiles"),

  createProfile: (
    userId: string,
    name: string,
    avatarUrl: string | undefined,
    isKids: boolean
  ): Promise<Profile> =>
    handleRequest<Profile>(
      () =>
        api.post("/profiles", { user_id: userId, name, avatar_url: avatarUrl, is_kids: isKids }),
      "Failed to create profile"
    ),

  updateProfile: (profileId: string, updates: Partial<Profile>): Promise<ProfileResponse> =>
    handleRequest<ProfileResponse>(
      () => api.put(`/profiles/${profileId}`, updates),
      "Failed to update profile"
    ),

  deleteProfile: (profileId: string) =>
    handleRequest(() => api.delete(`/profiles/${profileId}`), "Failed to delete profile"),

  updateProfileAvatar: (profileId: string, avatarData: string): Promise<ProfileResponse> =>
    handleRequest<ProfileResponse>(
      () => api.put(`/profiles/${profileId}/avatar`, { avatar_data: avatarData }),
      "Failed to update avatar"
    ),

  getPredefinedAvatars: (category = "default"): Promise<AvatarsResponse> =>
    handleRequest<AvatarsResponse>(
      () => api.get(`/avatars?category=${category}`),
      "Failed to get predefined avatars"
    ),
};

export const watchlistAPI = {
  getWatchlist: (profileId: string): Promise<WatchlistItem[]> =>
    handleRequest<WatchlistItem[]>(
      () => api.get(`/watchlist/${profileId}`),
      "Failed to get watchlist"
    ),

  addToWatchlist: (
    profileId: string,
    movieId: string,
    movieData: Omit<WatchlistItem, "id" | "added_at">
  ): Promise<WatchlistItemResponse> =>
    handleRequest<WatchlistItemResponse>(
      () => api.post(`/watchlist/${profileId}/${movieId}`, movieData),
      "Failed to add to watchlist"
    ),

  removeFromWatchlist: (profileId: string, movieId: string) =>
    handleRequest(
      () => api.delete(`/watchlist/${profileId}/${movieId}`),
      "Failed to remove from watchlist"
    ),
};

export const historyAPI = {
  getViewingHistory: (profileId: string) =>
    handleRequest(() => api.get(`/history/${profileId}`), "Failed to get viewing history"),

  addToHistory: (profileId: string, movieData: Omit<WatchlistItem, "id" | "added_at">) =>
    handleRequest(() => api.post(`/history/${profileId}`, movieData), "Failed to add to history"),
};

export const subscriptionAPI = {
  updateSubscription: (userId: string, subscriptionPlan: string) =>
    handleRequest(
      () => api.put(`/subscription/${userId}`, { subscription_plan: subscriptionPlan }),
      "Failed to update subscription"
    ),

  getPlans: (): Promise<PlansResponse> =>
    handleRequest<PlansResponse>(() => api.get("/plans"), "Failed to get plans"),
};

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
});

export const movieAPI = {
  fetchTrending: () => tmdbApi.get(`/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchSharkStreamerOriginals: () =>
    tmdbApi.get(`/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`),
  fetchTopRated: () => tmdbApi.get(`/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchActionMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`),
  fetchComedyMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`),
  fetchHorrorMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`),
  fetchRomanceMovies: () =>
    tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`),
  fetchDocumentaries: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`),
  fetchMovieDetails: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchVideos: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/videos?api_key=${TMDB_API_KEY}`),
  fetchImages: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/images?api_key=${TMDB_API_KEY}`),
  fetchReleaseDates: (movieId: string) =>
    tmdbApi.get(`/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`),
  fetchContentRatings: (tvId: string) =>
    tmdbApi.get(`/tv/${tvId}/content_ratings?api_key=${TMDB_API_KEY}`),
  fetchCredits: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/credits?api_key=${TMDB_API_KEY}`),
  fetchSimilar: async (movieType: string, movieId: string) => {
    const response = await tmdbApi.get(`/${movieType}/${movieId}/similar?api_key=${TMDB_API_KEY}`);

    const filteredResults = [];

    for (const item of response.data.results) {
      if (!(item.poster_path || item.backdrop_path)) {
        continue;
      }

      try {
        const videosResponse = await tmdbApi.get(
          `/${movieType}/${item.id}/videos?api_key=${TMDB_API_KEY}`
        );
        if (videosResponse.data.results && videosResponse.data.results.length > 0) {
          filteredResults.push(item);
        }
      } catch (error) {
        console.error(`Error checking videos for ${item.id}:`, error);
      }
    }

    return {
      ...response,
      data: {
        ...response.data,
        results: filteredResults,
      },
    };
  },

  searchMovies: (searchTerm: string, page = 1) => {
    const params = {
      api_key: TMDB_API_KEY,
      sort_by: "popularity.desc",
      include_adult: false,
      query: searchTerm,
      page: page,
    };
    return tmdbApi.get("/search/movie", { params });
  },

  searchTV: (searchTerm: string, page = 1) => {
    const params = {
      api_key: TMDB_API_KEY,
      sort_by: "popularity.desc",
      include_adult: false,
      query: searchTerm,
      page: page,
    };
    return tmdbApi.get("/search/tv", { params });
  },

  searchMoviesAndTV: async (searchTerm: string, page = 1) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return { results: [], hasNextPage: false, totalPages: 0 };
    }

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        movieAPI.searchMovies(searchTerm, page),
        movieAPI.searchTV(searchTerm, page),
      ]);

      interface MediaItem {
        id: number;
        title?: string;
        name?: string;
        overview: string;
        poster_path?: string;
        backdrop_path?: string;
        popularity: number;
      }

      const filterValidItems = (items: MediaItem[]): MediaItem[] => {
        if (!items || !Array.isArray(items)) return [];
        return items.filter((item) => {
          const hasImage = item.poster_path || item.backdrop_path;
          const hasTitle = item.title || item.name;
          const hasOverview = item.overview && item.overview.trim() !== "";
          const hasValidId = item.id && item.id > 0;
          const hasPopularity = item.popularity && item.popularity > 0;

          return hasTitle && hasValidId && hasImage && hasOverview && hasPopularity;
        });
      };

      const movieResults = filterValidItems(movieResponse?.data?.results).map((item) => ({
        ...item,
        media_type: "movie",
      }));

      const tvResults = filterValidItems(tvResponse?.data?.results).map((item) => ({
        ...item,
        media_type: "tv",
      }));

      const combinedResults = [...movieResults, ...tvResults].sort(
        (a, b) => b.popularity - a.popularity
      );

      const movieHasMore = page < (movieResponse?.data?.total_pages || 0);
      const tvHasMore = page < (tvResponse?.data?.total_pages || 0);
      const hasNextPage = movieHasMore || tvHasMore;

      return {
        results: combinedResults,
        hasNextPage,
        totalPages: Math.max(
          movieResponse?.data?.total_pages || 0,
          tvResponse?.data?.total_pages || 0
        ),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error searching movies and TV:", error);
      return { results: [], hasNextPage: false, totalPages: 0 };
    }
  },

  fetchFullMovieDetails: async (movieType: string, movieId: string) => {
    try {
      const [detailsResponse, creditsResponse, similarResponse] = await Promise.all([
        movieAPI.fetchMovieDetails(movieType, movieId),
        movieAPI.fetchCredits(movieType, movieId),
        movieAPI.fetchSimilar(movieType, movieId),
      ]);

      let ratingsResponse;
      if (movieType === "movie") {
        ratingsResponse = await movieAPI.fetchReleaseDates(movieId);
        detailsResponse.data.release_dates = ratingsResponse.data;
      } else {
        ratingsResponse = await movieAPI.fetchContentRatings(movieId);
        detailsResponse.data.content_ratings = ratingsResponse.data;
      }

      return {
        details: detailsResponse.data,
        credits: creditsResponse.data,
        similar: similarResponse.data.results || [],
      };
    } catch (error) {
      console.error("Error fetching full movie details:", error);
      throw error;
    }
  },
};

export default api;
