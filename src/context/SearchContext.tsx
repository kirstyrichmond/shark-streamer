import React, { createContext, useState, useContext, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { movieAPI } from '../services/api';
import { debounce } from 'lodash';

// Type definitions
interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  popularity: number;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

// Removed unused SearchResponse interface

interface SearchKeyChangeEvent {
  target: {
    value: string;
  };
}

interface SearchContextType {
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  handleSearchKeyChange: (e: SearchKeyChangeEvent) => void;
  showSearchBar: boolean;
  toggleSearchBar: (show: boolean) => void;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  movies: Movie[];
  isLoading: boolean;
  handleSearchSubmit: (e?: React.FormEvent) => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  loadMoreMovies: () => Promise<void>;
}

interface SearchProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const debouncedFetchMovies = useMemo(
    () => debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim() === '') {
        setMovies([]);
        setIsSearching(false);
        setIsLoading(false);
        setHasNextPage(false);
        setCurrentPage(1);
        return;
      }
      
      setIsLoading(true);
      setCurrentPage(1);

      try {
        const response = await movieAPI.searchMoviesAndTV(searchTerm, 1);
        
        if (response && Array.isArray(response.results)) {
          setMovies(response.results);
          setHasNextPage(response.hasNextPage || false);
          setIsSearching(true);
        } else {
          setMovies([]);
          setHasNextPage(false);
          setIsSearching(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
        setMovies([]);
        setIsSearching(false);
        setHasNextPage(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchKey.trim() !== '') {
      debouncedFetchMovies(searchKey);
    } else if (searchKey === '') {
      setMovies([]);
      setIsSearching(false);
    }
  }, [searchKey, debouncedFetchMovies]);

  const handleSearchKeyChange = useCallback((e: SearchKeyChangeEvent) => {
    const value = e.target.value;
    setSearchKey(value);
    
    if (value === '') {
      debouncedFetchMovies.cancel();
      setIsSearching(false);
      setIsLoading(false);
    }
  }, [debouncedFetchMovies]);

  const toggleSearchBar = useCallback((show: boolean) => {
    setShowSearchBar(show);
    
    if (!show) {
      debouncedFetchMovies.cancel();
      setIsSearching(false);
      setSearchKey('');
      setMovies([]);
      setIsLoading(false);
      setHasNextPage(false);
      setCurrentPage(1);
      setIsLoadingMore(false);
    }
  }, [debouncedFetchMovies]);

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
  }, []);

  const loadMoreMovies = useCallback(async (): Promise<void> => {
    if (!hasNextPage || isLoadingMore || !searchKey.trim()) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await movieAPI.searchMoviesAndTV(searchKey, nextPage);
      
      if (response && response.results) {
        setMovies(prevMovies => {
          const newMovies = response.results.filter(movie => 
            !prevMovies.find(existing => existing.id === movie.id)
          );
          return [...prevMovies, ...newMovies];
        });
        setHasNextPage(response.hasNextPage || false);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, searchKey, currentPage]);

  const value: SearchContextType = useMemo(() => ({
    searchKey,
    setSearchKey,
    handleSearchKeyChange,
    showSearchBar,
    toggleSearchBar,
    isSearching,
    setIsSearching,
    movies,
    isLoading,
    handleSearchSubmit,
    hasNextPage,
    isLoadingMore,
    loadMoreMovies
  }), [
    searchKey,
    handleSearchKeyChange,
    showSearchBar,
    toggleSearchBar,
    isSearching,
    movies,
    isLoading,
    handleSearchSubmit,
    hasNextPage,
    isLoadingMore,
    loadMoreMovies
  ]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};