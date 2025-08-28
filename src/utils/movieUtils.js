export const getMovieType = (movie) => {
  if (movie.media_type) {
    return movie.media_type;
  }
  
  if ((movie.first_air_date || movie.name) && !movie.title) {
    return 'tv';
  }
  
  if ((movie.release_date || movie.title) && !movie.name) {
    return 'movie';
  }
  
  return movie.name ? 'tv' : 'movie';
};