import { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { movieAPI } from '../services/api';
import { debounce } from 'lodash';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchKey, setSearchKey] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedFetchMovies = useMemo(
    () => debounce(async (searchTerm) => {
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

  const handleSearchKeyChange = useCallback((e) => {
    const value = e.target.value;
    setSearchKey(value);
    
    if (value === '') {
      debouncedFetchMovies.cancel();
      setIsSearching(false);
      setIsLoading(false);
    }
  }, [debouncedFetchMovies]);

  const toggleSearchBar = useCallback((show) => {
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

  const handleSearchSubmit = useCallback((e) => {
    if (e) e.preventDefault();
  }, []);

  const loadMoreMovies = useCallback(async () => {
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

  const value = useMemo(() => ({
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