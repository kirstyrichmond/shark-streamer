import axios from 'axios';

export const getApiUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    const envUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
    return envUrl;
  }

  const hostname = window.location.hostname;
  
  if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    const prodUrl = 'https://netflix-clone-dcjp.onrender.com/api';
    return prodUrl;
  } else {
    const devUrl = 'http://localhost:5000/api';
    return devUrl;
  }
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('netflix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleRequest = async (requestFn, errorMessage) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || errorMessage);
  }
};

export const authAPI = {
  register: async (email, password) => {
    const data = await handleRequest(
      () => api.post('/auth/register', { email, password }),
      'Registration failed'
    );
    if (data.access_token) {
      localStorage.setItem('netflix_token', data.access_token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await handleRequest(
      () => api.post('/auth/login', { email, password }),
      'Login failed'
    );
    if (data.access_token) {
      localStorage.setItem('netflix_token', data.access_token);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('netflix_token');
    }
    return { message: 'Logout successful' };
  },

  getCurrentUser: () => handleRequest(
    () => api.get('/auth/me'),
    'Failed to get user'
  )
};

export const profileAPI = {
  getUserProfiles: (userId) => handleRequest(
    () => api.get(`/profiles/user/${userId}`),
    'Failed to get profiles'
  ),

  createProfile: (userId, name, avatarUrl = null, isKids = false) => handleRequest(
    () => api.post('/profiles', { user_id: userId, name, avatar_url: avatarUrl, is_kids: isKids }),
    'Failed to create profile'
  ),

  updateProfile: (profileId, updates) => handleRequest(
    () => api.put(`/profiles/${profileId}`, updates),
    'Failed to update profile'
  ),

  deleteProfile: (profileId) => handleRequest(
    () => api.delete(`/profiles/${profileId}`),
    'Failed to delete profile'
  ),

  updateProfileAvatar: (profileId, avatarData) => handleRequest(
    () => api.put(`/profiles/${profileId}/avatar`, { avatar_data: avatarData }),
    'Failed to update avatar'
  ),

  getPredefinedAvatars: (category = 'default') => handleRequest(
    () => api.get(`/avatars?category=${category}`),
    'Failed to get predefined avatars'
  )
};

export const watchlistAPI = {
  getWatchlist: (profileId) => handleRequest(
    () => api.get(`/watchlist/${profileId}`),
    'Failed to get watchlist'
  ),

  addToWatchlist: (profileId, movieId, movieData) => handleRequest(
    () => api.post(`/watchlist/${profileId}/${movieId}`, movieData),
    'Failed to add to watchlist'
  ),

  removeFromWatchlist: (profileId, movieId) => handleRequest(
    () => api.delete(`/watchlist/${profileId}/${movieId}`),
    'Failed to remove from watchlist'
  )
};

export const historyAPI = {
  getViewingHistory: (profileId) => handleRequest(
    () => api.get(`/history/${profileId}`),
    'Failed to get viewing history'
  ),

  addToHistory: (profileId, movieData) => handleRequest(
    () => api.post(`/history/${profileId}`, movieData),
    'Failed to add to history'
  )
};

export const subscriptionAPI = {
  updateSubscription: (userId, subscriptionPlan) => handleRequest(
    () => api.put(`/subscription/${userId}`, { subscription_plan: subscriptionPlan }),
    'Failed to update subscription'
  ),

  getPlans: () => handleRequest(
    () => api.get('/plans'),
    'Failed to get plans'
  )
};

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
});

export const movieAPI = {
  fetchTrending: () => tmdbApi.get(`/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchNetflixOriginals: () => tmdbApi.get(`/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`),
  fetchTopRated: () => tmdbApi.get(`/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchActionMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`),
  fetchComedyMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`),
  fetchHorrorMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`),
  fetchRomanceMovies: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`),
  fetchDocumentaries: () => tmdbApi.get(`/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`),
  fetchMovieDetails: (movieType, movieId) => tmdbApi.get(`/${movieType}/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`),
  fetchVideos: (movieType, movieId) => tmdbApi.get(`/${movieType}/${movieId}/videos?api_key=${TMDB_API_KEY}`),
  fetchImages: (movieType, movieId) => tmdbApi.get(`/${movieType}/${movieId}/images?api_key=${TMDB_API_KEY}`),
  fetchReleaseDates: (movieId) => tmdbApi.get(`/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`),
  fetchContentRatings: (tvId) => tmdbApi.get(`/tv/${tvId}/content_ratings?api_key=${TMDB_API_KEY}`),
  fetchCredits: (movieType, movieId) => tmdbApi.get(`/${movieType}/${movieId}/credits?api_key=${TMDB_API_KEY}`),
  fetchSimilar: (movieType, movieId) => tmdbApi.get(`/${movieType}/${movieId}/similar?api_key=${TMDB_API_KEY}`),

  searchMovies: (searchTerm, page = 1) => {
    const params = {
      api_key: TMDB_API_KEY,
      sort_by: 'popularity.desc',
      include_adult: false,
      query: searchTerm,
      page: page
    };
    return tmdbApi.get('/search/movie', { params });
  },

  searchTV: (searchTerm, page = 1) => {
    const params = {
      api_key: TMDB_API_KEY,
      sort_by: 'popularity.desc',
      include_adult: false,
      query: searchTerm,
      page: page
    };
    return tmdbApi.get('/search/tv', { params });
  },

  searchMoviesAndTV: async (searchTerm, page = 1) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return { results: [], hasNextPage: false, totalPages: 0 };
    }
    
    try {
      const [movieResponse, tvResponse] = await Promise.all([
        movieAPI.searchMovies(searchTerm, page),
        movieAPI.searchTV(searchTerm, page)
      ]);
      
      const filterValidItems = (items) => {
        if (!items || !Array.isArray(items)) return [];
        return items.filter(item => {
          const hasImage = item.poster_path || item.backdrop_path;
          const hasTitle = item.title || item.name;
          const hasOverview = item.overview && item.overview.trim() !== '';
          const hasValidId = item.id && item.id > 0;
          const hasPopularity = item.popularity && item.popularity > 0;

          return hasTitle && hasValidId && hasImage && hasOverview && hasPopularity;
        });
      };

      const movieResults = filterValidItems(movieResponse?.data?.results).map(item => ({
        ...item,
        media_type: 'movie'
      }));
      
      const tvResults = filterValidItems(tvResponse?.data?.results).map(item => ({
        ...item,
        media_type: 'tv'
      }));
      
      const combinedResults = [...movieResults, ...tvResults].sort((a, b) => b.popularity - a.popularity);
      
      const movieHasMore = page < (movieResponse?.data?.total_pages || 0);
      const tvHasMore = page < (tvResponse?.data?.total_pages || 0);
      const hasNextPage = movieHasMore || tvHasMore;
      
      return {
        results: combinedResults,
        hasNextPage,
        totalPages: Math.max(movieResponse?.data?.total_pages || 0, tvResponse?.data?.total_pages || 0),
        currentPage: page
      };
    } catch (error) {
      console.error("Error searching movies and TV:", error);
      return { results: [], hasNextPage: false, totalPages: 0 };
    }
  },

  fetchFullMovieDetails: async (movieType, movieId) => {
    try {
      const [detailsResponse, creditsResponse, similarResponse] = await Promise.all([
        movieAPI.fetchMovieDetails(movieType, movieId),
        movieAPI.fetchCredits(movieType, movieId),
        movieAPI.fetchSimilar(movieType, movieId)
      ]);

      let ratingsResponse;
      if (movieType === 'movie') {
        ratingsResponse = await movieAPI.fetchReleaseDates(movieId);
        detailsResponse.data.release_dates = ratingsResponse.data;
      } else {
        ratingsResponse = await movieAPI.fetchContentRatings(movieId);
        detailsResponse.data.content_ratings = ratingsResponse.data;
      }

      return {
        details: detailsResponse.data,
        credits: creditsResponse.data,
        similar: similarResponse.data.results || []
      };
    } catch (error) {
      console.error("Error fetching full movie details:", error);
      throw error;
    }
  }
};

export default api;