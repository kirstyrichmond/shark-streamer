import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_KEY } from '../Requests';
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
    const type = searchTerm ? 'search' : 'discover';
    
    try {      
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        include_adult: false
      };
      
      if (searchTerm) {
        params.query = searchTerm;
      }
      
      const requestMovies = await axios.get(
        `https://api.themoviedb.org/3/${type}/movie`,
        { params }
      );
      
      const requestTv = await axios.get(
        `https://api.themoviedb.org/3/${type}/tv`,
        { params }
      );
      
      const movieResults = requestMovies.data.results.map(item => ({
        ...item,
        media_type: 'movie'
      }));
      
      const tvResults = requestTv.data.results.map(item => ({
        ...item,
        media_type: 'tv'
      }));
      
      const combinedResults = [...movieResults, ...tvResults].sort((a, b) => {
        return b.popularity - a.popularity;
      });
            
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