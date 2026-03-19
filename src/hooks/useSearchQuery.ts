import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo, useEffect, useState } from "react";
import { movieAPI } from "../services/api";
import { Movie } from "../utils/movieUtils";
import { useMovieFiltering } from "./useMovieFiltering";

interface SearchResponse {
  results: Movie[];
  hasNextPage: boolean;
}

export const useSearchQuery = (searchTerm: string) => {
  const { filterMovies } = useMovieFiltering();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["movies", "search", searchTerm],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      if (!searchTerm || searchTerm.trim() === "") {
        return { results: [], hasNextPage: false };
      }
      const result = await movieAPI.searchMoviesAndTV(searchTerm, pageParam);
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResponse, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    enabled: !!searchTerm && searchTerm.trim() !== "",
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });


  const movies = useMemo(() => {
    if (!data?.pages) return [];
    const flattened = data.pages.flatMap((page) => page.results || []);
    return flattened;
  }, [data]);

  useEffect(() => {
    if (movies.length > 0) {
      const filterData = async () => {
        try {
          const validMovies = await filterMovies(movies, {
            requireVideos: true,
            requireLogos: false,
            requireImages: true,
            isLargeRow: false,
          });
          setFilteredMovies(validMovies);
        } catch (error) {
          console.error("Error filtering search results:", error);
          setFilteredMovies(movies);
        }
      };
      filterData();
    } else {
      setFilteredMovies([]);
    }
  }, [movies, filterMovies]);

  return {
    movies: filteredMovies,
    hasNextPage: !!hasNextPage,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    isFetching,
    loadMoreMovies: fetchNextPage,
    error,
  };
};