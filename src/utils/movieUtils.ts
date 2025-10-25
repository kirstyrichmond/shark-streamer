
export interface Movie {
  id?: number | string;
  movie_id?: string;
  media_type?: string;
  movie_type?: 'movie' | 'tv';
  first_air_date?: string;
  name?: string;
  title?: string;
  movie_title?: string;
  original_title?: string;
  original_name?: string;
  release_date?: string;
  overview?: string;
  backdrop_path?: string;
  poster_path?: string;
  movie_poster?: string;
  added_at?: string;
}

export const getMovieType = (movie: Movie): 'movie' | 'tv' => {
  if (movie.media_type === 'tv' || movie.media_type === 'movie') return movie.media_type;
  if (movie.first_air_date || (movie.name && !movie.title)) return 'tv';
  return 'movie';
};

export const getApiUrl = (movie: Movie) => {
  if (!movie?.id) return "";
  const movieType = getMovieType(movie);
  return `https://api.themoviedb.org/3/${movieType}/${movie.id}`;
};

export const getMovieTitle = (movie: Movie) => {
  return movie.title || movie.name || movie.original_title || movie.original_name || 'Unknown Title';
};

export const getMovieYear = (movie: Movie) => {
  const date = movie.release_date || movie.first_air_date;
  return date ? new Date(date).getFullYear() : null;
};

export const getImageUrl = (path: string, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};