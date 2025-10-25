// Testing Redux state changes (the "brain" of our app)
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  addToWatchlist,
  removeFromWatchlist,
  fetchWatchlist,
} from '../../store/slices/userSlice';

// We "mock" the API so tests run fast and don't depend on internet
jest.mock('../../services/api', () => ({
  watchlistAPI: {
    getWatchlist: jest.fn(),
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
  }
}));

// Import the mocked API
import { watchlistAPI } from '../../services/api';

describe('Watchlist Redux Logic', () => {
  let store;

  // Test data - like fake movies and profiles
  const mockMovie = {
    id: 123,
    title: 'The Matrix',
    poster_path: '/matrix-poster.jpg'
  };

  const mockWatchlistItem = {
    id: 1,
    movie_id: '123',
    movie_title: 'The Matrix',
    movie_poster: '/matrix-poster.jpg',
    movie_type: 'movie',
    added_at: '2023-01-01T00:00:00Z'
  };

  // This runs before each test - gives us a fresh store
  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    jest.clearAllMocks(); // Reset all mocks
  });

  describe('Adding to Watchlist', () => {
    it('should add a movie to empty watchlist', async () => {
      // Mock API response
      watchlistAPI.addToWatchlist.mockResolvedValue({ item: mockWatchlistItem });

      // Start with empty watchlist
      store.dispatch({ 
        type: 'user/fetchWatchlist/fulfilled', 
        payload: { profileId: 'profile-1', watchlist: [] } 
      });

      // Try to add a movie
      await store.dispatch(addToWatchlist({
        profileId: 'profile-1',
        movieId: '123',
        movieData: {
          movie_title: 'The Matrix',
          movie_poster: '/matrix-poster.jpg',
          movie_type: 'movie'
        }
      }));

      // Check if it was added
      const state = store.getState().user;
      expect(state.user.watchlist.items).toHaveLength(1);
      expect(state.user.watchlist.items[0].movie_title).toBe('The Matrix');
    });

    it('should NOT add duplicate movies', async () => {
      // Mock API response
      watchlistAPI.addToWatchlist.mockResolvedValue({ item: mockWatchlistItem });

      // Start with movie already in watchlist
      store.dispatch({ 
        type: 'user/fetchWatchlist/fulfilled', 
        payload: { profileId: 'profile-1', watchlist: [mockWatchlistItem] } 
      });

      // Try to add the same movie again
      await store.dispatch(addToWatchlist({
        profileId: 'profile-1',
        movieId: '123', // Same movie ID
        movieData: {
          movie_title: 'The Matrix',
          movie_poster: '/matrix-poster.jpg',
          movie_type: 'movie'
        }
      }));

      // Should still only have 1 movie (no duplicates)
      const state = store.getState().user;
      expect(state.user.watchlist.items).toHaveLength(1);
    });
  });

  describe('Removing from Watchlist', () => {
    it('should remove a movie from watchlist', async () => {
      // Mock successful API call
      watchlistAPI.removeFromWatchlist.mockResolvedValue();

      // Start with movie in watchlist
      store.dispatch({ 
        type: 'user/fetchWatchlist/fulfilled', 
        payload: { profileId: 'profile-1', watchlist: [mockWatchlistItem] } 
      });

      // Remove the movie
      await store.dispatch(removeFromWatchlist({
        profileId: 'profile-1',
        movieId: '123'
      }));

      // Check if it was removed
      const state = store.getState().user;
      expect(state.user.watchlist.items).toHaveLength(0);
    });
  });

  describe('Loading States', () => {
    it('should show loading when fetching watchlist', () => {
      // Mock API call that takes time
      watchlistAPI.getWatchlist.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      // Start fetching
      store.dispatch(fetchWatchlist('profile-1'));

      // Check loading state
      const state = store.getState().user;
      expect(state.user.watchlist.loading).toBe(true);
    });
  });
});