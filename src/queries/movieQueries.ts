import { movieAPI } from "../services/api";
import { Movie } from "../utils/movieUtils";

export const movieQueries = {
  trending: () => ({
    queryKey: ["movies", "trending"],
    queryFn: async () => {
      const request = await movieAPI.fetchTrending();
      return request.data.results;
    },
    staleTime: 1000 * 60 * 5,
  }),

  trendingBanner: () => ({
    queryKey: ["movies", "trending", "banner"],
    queryFn: async () => {
      const request = await movieAPI.fetchTrending();
      const movies = request.data.results;
      const moviesWithBackdrops = movies.filter((movie: Movie) => movie.backdrop_path);
      const randomIndex = Math.floor(Math.random() * moviesWithBackdrops.length);
      return moviesWithBackdrops[randomIndex];
    },
    staleTime: 1000 * 60 * 5,
  }),

  videos: (type: string, id: string) => ({
    queryKey: ["movies", type, id, "videos"],
    queryFn: async () => {
      if (!id) return [];
      const request = await movieAPI.fetchVideos(type, id);
      return request.data.results || [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  }),

  images: (type: string, id: string) => ({
    queryKey: ["movies", type, id, "images"],
    queryFn: async () => {
      if (!id) return { logos: [], backdrops: [], posters: [] };
      const request = await movieAPI.fetchImages(type, id);
      return request.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  }),

  watchlist: (profileId: string) => ({
    queryKey: ["watchlist", profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const response = await fetch(`http://localhost:5001/api/watchlist/${profileId}`);
      if (!response.ok) throw new Error("Failed to fetch watchlist");
      return response.json();
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  }),

  userAuth: () => ({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5001/api/auth/me");
      if (!response.ok) throw new Error("Failed to fetch user auth");
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  }),

  search: (searchTerm: string, page: number = 1) => ({
    queryKey: ["movies", "search", searchTerm, page],
    queryFn: async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        return { results: [], hasNextPage: false };
      }
      return await movieAPI.searchMoviesAndTV(searchTerm, page);
    },
    enabled: !!searchTerm && searchTerm.trim() !== "",
    staleTime: 1000 * 60 * 5,
  }),

  details: (type: string, id: string) => ({
    queryKey: ["movies", type, id, "details"],
    queryFn: async () => {
      if (!id) return null;
      const response = await movieAPI.fetchMovieDetails(type, id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  }),

  credits: (type: string, id: string) => ({
    queryKey: ["movies", type, id, "credits"],
    queryFn: async () => {
      if (!id) return { cast: [], crew: [] };
      const response = await movieAPI.fetchCredits(type, id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  }),

  similar: (type: string, id: string) => ({
    queryKey: ["movies", type, id, "similar"],
    queryFn: async () => {
      if (!id) return [];
      const response = await movieAPI.fetchSimilar(type, id);
      return response.data.results || [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  }),

  releaseDates: (id: string) => ({
    queryKey: ["movies", "movie", id, "release-dates"],
    queryFn: async () => {
      if (!id) return { results: [] };
      const response = await movieAPI.fetchReleaseDates(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  }),

  contentRatings: (id: string) => ({
    queryKey: ["movies", "tv", id, "content-ratings"],
    queryFn: async () => {
      if (!id) return { results: [] };
      const response = await movieAPI.fetchContentRatings(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  }),

  row: (title: string, fetchRequest: () => Promise<{ data: { results: Movie[] } }>) => ({
    queryKey: ["movies", "row", title],
    queryFn: async () => {
      const request = await fetchRequest();
      return request.data.results;
    },
    staleTime: 1000 * 60 * 5,
  }),
};