import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";
import { movieAPI } from "../services/api";
import { Movie } from "../utils/movieUtils";

interface SearchResponse {
  results: Movie[];
  hasNextPage: boolean;
}

export const useSearchQuery = (searchTerm: string) => {
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

  return {
    movies,
    hasNextPage: !!hasNextPage,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    isFetching,
    loadMoreMovies: fetchNextPage,
    error,
  };
};