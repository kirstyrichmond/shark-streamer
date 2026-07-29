import axios from "axios";
import { Profile, WatchlistItem, User, Plan } from "../store/slices/userSlice";

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

interface WatchlistItemResponse {
  item: WatchlistItem;
}

export const getApiUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    const envUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
    return envUrl;
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const devUrl = "http://localhost:5001/api";
    return devUrl;
  }

  const prodUrl = "https://shark-streamer-dcjp.onrender.com/api";
  return prodUrl;
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

const handleRequest = async <T>(requestFn: () => Promise<{ data: T }>, errorMessage: string): Promise<T> => {
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

  createProfile: (userId: string, name: string, avatarUrl: string | undefined, isKids: boolean): Promise<Profile> =>
    handleRequest<Profile>(
      () => api.post("/profiles", { user_id: userId, name, avatar_url: avatarUrl, is_kids: isKids }),
      "Failed to create profile"
    ),

  updateProfile: (profileId: string, updates: Partial<Profile>): Promise<ProfileResponse> =>
    handleRequest<ProfileResponse>(() => api.put(`/profiles/${profileId}`, updates), "Failed to update profile"),

  deleteProfile: (profileId: string) =>
    handleRequest(() => api.delete(`/profiles/${profileId}`), "Failed to delete profile"),

  updateProfileAvatar: (profileId: string, avatarData: string): Promise<ProfileResponse> =>
    handleRequest<ProfileResponse>(
      () => api.put(`/profiles/${profileId}/avatar`, { avatar_data: avatarData }),
      "Failed to update avatar"
    ),
};

export const watchlistAPI = {
  getWatchlist: (profileId: string): Promise<WatchlistItem[]> =>
    handleRequest<WatchlistItem[]>(() => api.get(`/watchlist/${profileId}`), "Failed to get watchlist"),

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
    handleRequest(() => api.delete(`/watchlist/${profileId}/${movieId}`), "Failed to remove from watchlist"),
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

  getPlans: (): Promise<PlansResponse> => handleRequest<PlansResponse>(() => api.get("/plans"), "Failed to get plans"),
};

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
});

export const movieAPI = {
  fetchTrending: () => tmdbApi.get(`/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchSharkStreamerOriginals: () => tmdbApi.get(`/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`),
  fetchTopRated: () => tmdbApi.get(`/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchActionMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`),
  fetchComedyMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`),
  fetchHorrorMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`),
  fetchRomanceMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`),
  fetchDocumentaries: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`),
  fetchMovieDetails: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchVideos: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/videos?api_key=${TMDB_API_KEY}`),
  fetchImages: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/images?api_key=${TMDB_API_KEY}`),
  fetchReleaseDates: (movieId: string) => tmdbApi.get(`/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`),
  fetchContentRatings: (tvId: string) => tmdbApi.get(`/tv/${tvId}/content_ratings?api_key=${TMDB_API_KEY}`),
  fetchCredits: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/credits?api_key=${TMDB_API_KEY}`),
  fetchSimilar: (movieType: string, movieId: string) =>
    tmdbApi.get(`/${movieType}/${movieId}/similar?api_key=${TMDB_API_KEY}`),

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

  searchMoviesAndTV: async (searchTerm: string, startTmdbPage = 1, targetResultCount = 100) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return { results: [], hasNextPage: false, nextTmdbPage: startTmdbPage };
    }

    interface MediaItem {
      id: number;
      title?: string;
      name?: string;
      overview: string;
      poster_path?: string;
      backdrop_path?: string;
      popularity: number;
      original_language?: string;
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filterValidItems = (items: MediaItem[]): MediaItem[] => {
      if (!items || !Array.isArray(items)) return [];
      return items.filter((item) => {
        const title = item.title || item.name;
        const hasImage = item.poster_path || item.backdrop_path;
        const hasOverview = item.overview && item.overview.trim() !== "";
        const hasValidId = item.id && item.id > 0;
        const hasPopularity = item.popularity && item.popularity > 0;
        const matchesSearchTerm = !!title && title.toLowerCase().includes(normalizedSearchTerm);

        return matchesSearchTerm && hasValidId && hasImage && hasOverview && hasPopularity;
      });
    };

    const BATCH_SIZE = 5;
    const seenIds = new Set<string>();
    const collected: Array<MediaItem & { media_type: "movie" | "tv" }> = [];

    let currentTmdbPage = startTmdbPage;
    let movieTotalPages = Infinity;
    let tvTotalPages = Infinity;

    try {
      while (
        collected.length < targetResultCount &&
        (currentTmdbPage <= movieTotalPages || currentTmdbPage <= tvTotalPages)
      ) {
        const batchPages = Array.from({ length: BATCH_SIZE }, (_, i) => currentTmdbPage + i);

        const [movieResponses, tvResponses] = await Promise.all([
          currentTmdbPage <= movieTotalPages
            ? Promise.all(batchPages.map((tmdbPage) => movieAPI.searchMovies(searchTerm, tmdbPage)))
            : Promise.resolve([]),
          currentTmdbPage <= tvTotalPages
            ? Promise.all(batchPages.map((tmdbPage) => movieAPI.searchTV(searchTerm, tmdbPage)))
            : Promise.resolve([]),
        ]);

        if (movieResponses.length) movieTotalPages = movieResponses[0]?.data?.total_pages || 0;
        if (tvResponses.length) tvTotalPages = tvResponses[0]?.data?.total_pages || 0;

        const onlyInRangePages = (responses: typeof movieResponses, totalPages: number) =>
          responses.flatMap((response, i) => (batchPages[i] <= totalPages ? response?.data?.results || [] : []));

        const movieResults = filterValidItems(onlyInRangePages(movieResponses, movieTotalPages)).map((item) => ({
          ...item,
          media_type: "movie" as const,
        }));

        const tvResults = filterValidItems(onlyInRangePages(tvResponses, tvTotalPages)).map((item) => ({
          ...item,
          media_type: "tv" as const,
        }));

        for (const item of [...movieResults, ...tvResults]) {
          const dedupeKey = `${item.media_type}-${item.id}`;
          if (seenIds.has(dedupeKey)) continue;
          seenIds.add(dedupeKey);
          collected.push(item);
        }

        currentTmdbPage += BATCH_SIZE;
      }

      collected.sort((a, b) => {
        const aIsEnglish = a.original_language === "en" ? 1 : 0;
        const bIsEnglish = b.original_language === "en" ? 1 : 0;
        return aIsEnglish !== bIsEnglish ? bIsEnglish - aIsEnglish : b.popularity - a.popularity;
      });

      const hasNextPage = currentTmdbPage <= movieTotalPages || currentTmdbPage <= tvTotalPages;

      return {
        results: collected.slice(0, targetResultCount),
        hasNextPage,
        nextTmdbPage: currentTmdbPage,
      };
    } catch (error) {
      console.error("Error searching movies and TV:", error);
      return { results: [], hasNextPage: false, nextTmdbPage: startTmdbPage };
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
