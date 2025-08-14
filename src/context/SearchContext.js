import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
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

  const fetchMovies = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setMovies([]);
      setIsSearching(false);
      return [];
    }
    
    setIsLoading(true);
    
    try {      
      const combinedResults = await movieAPI.searchMoviesAndTV(searchTerm);
            
      setMovies(combinedResults);
      
      if (searchTerm) {
        setIsSearching(true);
      }
      
      setIsLoading(false);
      return combinedResults;
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
      return [];
    }
  };

  const debouncedFetchMovies = useCallback(
    debounce((searchTerm) => {
      fetchMovies(searchTerm);
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

  const handleSearchKeyChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    
    if (value === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const toggleSearchBar = (show) => {
    setShowSearchBar(show);
    
    if (!show) {
      setIsSearching(false);
      setSearchKey('');
      setMovies([]);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
  };

  const value = {
    searchKey,
    setSearchKey,
    handleSearchKeyChange,
    showSearchBar,
    toggleSearchBar,
    isSearching,
    setIsSearching,
    movies,
    isLoading,
    handleSearchSubmit
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};