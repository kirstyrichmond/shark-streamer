import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useEffect, useState, useRef } from "react";
import { movieAPI } from "../services/api";
import { getMovieKey, Movie } from "../utils/movieUtils";
import { useMovieFiltering } from "./useMovieFiltering";

interface SearchResponse {
  results: Movie[];
  hasNextPage: boolean;
  nextTmdbPage: number;
}

export const useSearchQuery = (searchTerm: string) => {
  const { filterMovies } = useMovieFiltering();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [hasFilteredFirstBatch, setHasFilteredFirstBatch] = useState(false);
  const [committedSearchTerm, setCommittedSearchTerm] = useState(searchTerm);
  const processedKeysRef = useRef<Set<string>>(new Set());

  if (searchTerm !== committedSearchTerm) {
    setCommittedSearchTerm(searchTerm);
    setFilteredMovies([]);
    setHasFilteredFirstBatch(false);
    processedKeysRef.current = new Set();
  }

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
        return { results: [], hasNextPage: false, nextTmdbPage: pageParam };
      }
      const result = await movieAPI.searchMoviesAndTV(searchTerm, pageParam);
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResponse) => {
      return lastPage.hasNextPage ? lastPage.nextTmdbPage : undefined;
    },
    enabled: !!searchTerm && searchTerm.trim() !== "",
    staleTime: 1000 * 60 * 5,
  });


  const movies = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results || []);
  }, [data]);

  const latestPageResults = useMemo(() => {
    if (!data?.pages?.length) return [];
    return data.pages[data.pages.length - 1].results || [];
  }, [data]);

  useEffect(() => {
    const newItems = latestPageResults.filter((movie) => !processedKeysRef.current.has(getMovieKey(movie)));
    if (newItems.length === 0) return;

    newItems.forEach((movie) => processedKeysRef.current.add(getMovieKey(movie)));

    let cancelled = false;

    const FILTER_CHUNK_SIZE = 24;
    const chunks: Movie[][] = [];
    for (let i = 0; i < newItems.length; i += FILTER_CHUNK_SIZE) {
      chunks.push(newItems.slice(i, i + FILTER_CHUNK_SIZE));
    }
    let chunksRemaining = chunks.length;

    const filterChunk = async (chunk: Movie[]) => {
      try {
        const validMovies = await filterMovies(chunk, {
          requireVideos: true,
          requireLogos: false,
          requireImages: true,
          isLargeRow: false,
          maxMovies: chunk.length,
        });
        if (cancelled) return;
        if (validMovies.length > 0) {
          setFilteredMovies((prev) => [...prev, ...validMovies]);
          setHasFilteredFirstBatch(true);
        }
      } catch (error) {
        console.error("Error filtering search results:", error);
        if (!cancelled) {
          setFilteredMovies((prev) => [...prev, ...chunk]);
          setHasFilteredFirstBatch(true);
        }
      } finally {
        chunksRemaining -= 1;
        if (!cancelled && chunksRemaining === 0) setHasFilteredFirstBatch(true);
      }
    };

    chunks.forEach(filterChunk);

    return () => {
      cancelled = true;
    };
  }, [latestPageResults, filterMovies]);

  return {
    movies: filteredMovies,
    hasNextPage: !!hasNextPage,
    isLoading: isLoading || (movies.length > 0 && !hasFilteredFirstBatch),
    isLoadingMore: isFetchingNextPage,
    isFetching,
    loadMoreMovies: fetchNextPage,
    error,
  };
};