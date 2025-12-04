import { useState, useCallback } from "react";
import { movieAPI } from "../services/api";
import { getMovieType, Movie } from "../utils/movieUtils";

interface FilterableMovie {
  id: number | string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
}

interface FilterOptions {
  requireImages?: boolean;
  requireLogos?: boolean;
  requireVideos?: boolean;
  isLargeRow?: boolean;
  maxMovies?: number;
  resultLimit?: number;
}

export const useMovieFiltering = () => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteringError, setFilteringError] = useState<string | null>(null);

  const filterMovies = useCallback(async <T extends FilterableMovie>(
    movies: T[],
    options: FilterOptions = {},
    movieType?: string
  ): Promise<T[]> => {
    const {
      requireImages = true,
      requireLogos = true,
      requireVideos = true,
      isLargeRow = false,
      maxMovies = 20,
      resultLimit = Infinity
    } = options;

    if (!movies.length) return [];

    setIsFiltering(true);
    setFilteringError(null);

    try {
      let filteredMovies = movies;
      if (requireImages) {
        filteredMovies = movies.filter((movie) => 
          (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)
        );
      }

      if (!requireLogos && !requireVideos) {
        setIsFiltering(false);
        return filteredMovies.slice(0, resultLimit);
      }

      const movieChecks = filteredMovies.slice(0, maxMovies).map(async (movie) => {
        try {
          const type = movieType || getMovieType(movie as Movie);
          
          const promises = [];
          if (requireVideos) {
            promises.push(movieAPI.fetchVideos(type, String(movie.id)));
          }
          if (requireLogos) {
            promises.push(movieAPI.fetchImages(type, String(movie.id)));
          }

          const responses = await Promise.all(promises);
          
          let hasVideos = true;
          let hasLogo = true;
          
          if (requireVideos && requireLogos) {
            const [videosResponse, imagesResponse] = responses;
            hasVideos = videosResponse.data.results && videosResponse.data.results.length > 0;
            hasLogo = imagesResponse.data.logos && imagesResponse.data.logos.length > 0;
          } else if (requireVideos) {
            const [videosResponse] = responses;
            hasVideos = videosResponse.data.results && videosResponse.data.results.length > 0;
          } else if (requireLogos) {
            const [imagesResponse] = responses;
            hasLogo = imagesResponse.data.logos && imagesResponse.data.logos.length > 0;
          }

          return (hasVideos && hasLogo) ? movie : null;
        } catch (error) {
          console.error(`Error checking requirements for movie ${movie.id}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(movieChecks);
      const validMovies = results
        .filter((result) => result.status === "fulfilled" && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<T>).value)
        .slice(0, resultLimit);

      setIsFiltering(false);
      return validMovies;
    } catch (error) {
      console.error("Error filtering movies:", error);
      setFilteringError(error instanceof Error ? error.message : "Failed to filter movies");
      setIsFiltering(false);
      return movies.filter((movie) => 
        (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)
      ).slice(0, resultLimit);
    }
  }, []);

  return {
    filterMovies,
    isFiltering,
    filteringError,
  };
};