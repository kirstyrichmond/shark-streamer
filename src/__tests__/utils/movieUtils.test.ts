import { getMovieType } from '../../utils/movieUtils';

describe('getMovieType utility function', () => {
  
  it('should return "movie" for a movie object', () => {
    const movieObject = {
      id: 123,
      title: 'Spider-Man',
      release_date: '2023-01-01'
    };

    const result = getMovieType(movieObject);

    expect(result).toBe('movie');
  });

  it('should return "tv" for a TV show object', () => {
    const tvObject = {
      id: 456,
      name: 'Breaking Bad',
      first_air_date: '2008-01-20'
    };

    const result = getMovieType(tvObject);

    expect(result).toBe('tv');
  });

  it('should use media_type when provided', () => {
    const objectWithMediaType = {
      id: 789,
      title: 'Some Movie',
      name: 'Some Show',
      media_type: 'tv'
    };

    const result = getMovieType(objectWithMediaType);

    expect(result).toBe('tv');
  });

  it('should default to "movie" when properties are ambiguous', () => {
    const ambiguousObject = {
      id: 999
    };

    const result = getMovieType(ambiguousObject);

    expect(result).toBe('movie');
  });
});