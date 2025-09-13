export const getMovieType = (movie) => {
  if (movie.media_type) return movie.media_type;
  if (movie.first_air_date || (movie.name && !movie.title)) return 'tv';
  return 'movie';
};

export const getApiUrl = (movie) => {
  if (!movie?.id) return "";
  const movieType = getMovieType(movie);
  return `https://api.themoviedb.org/3/${movieType}/${movie.id}`;
};

export const getMovieTitle = (movie) => {
  return movie.title || movie.name || movie.original_title || movie.original_name || 'Unknown Title';
};

export const getMovieYear = (movie) => {
  const date = movie.release_date || movie.first_air_date;
  return date ? new Date(date).getFullYear() : null;
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};