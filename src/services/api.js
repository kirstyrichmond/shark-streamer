import axios from 'axios';

export const getApiUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    const envUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
    console.log('Using REACT_APP_API_BASE_URL:', envUrl);
    return envUrl;
  }

  const hostname = window.location.hostname;
  
  if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    const prodUrl = 'https://netflix-clone-dcjp.onrender.com/api';
    console.log('Using production URL:', prodUrl);
    return prodUrl;
  } else {
    const devUrl = 'http://localhost:5000/api';
    console.log('Using development URL:', devUrl);
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

export default api;