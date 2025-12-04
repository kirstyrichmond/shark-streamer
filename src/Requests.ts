export const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

interface Requests {
  fetchTrending: string;
  fetchSharkStreamerOriginals: string;
  fetchTopRated: string;
  fetchActionMovies: string;
  fetchComedyMovies: string;
  fetchHorrorMovies: string;
  fetchRomanceMovies: string;
  fetchDocumentaries: string;
  fetchVideos: (movieId: string | number) => string;
  fetchImages: (movieId: string | number) => string;
  fetchMovieDetails: (movieType: string, movieId: string | number) => string;
}

const requests: Requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchSharkStreamerOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchVideos: (movieId) => `/movie/${movieId}/videos?language=en-US`,
  fetchImages: (movieId) => `/movie/${movieId}/images?language=en-US`,
  fetchMovieDetails: (movieType, movieId) => `/${movieType}/${movieId}?api_key=${API_KEY}&language=en-US`,
};

export default requests;
