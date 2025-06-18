import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_KEY } from '../Requests'; // Adjust path as needed
import { debounce } from 'lodash'; // Import debounce from lodash

// Create the context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchKey, setSearchKey] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch movies function
  const fetchMovies = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setMovies([]);
      setIsSearching(false);
      return [];
    }
    
    setIsLoading(true);
    const type = searchTerm ? 'search' : 'discover';
    
    try {
      console.log("Fetching movies with searchKey:", searchTerm);
      
      // Additional parameters for better sorting and results
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc', // Sort by popularity (descending)
        include_adult: false        // Exclude adult content
      };
      
      // Add query parameter only if searchTerm exists
      if (searchTerm) {
        params.query = searchTerm;
      }
      
      // Fetch movies
      const requestMovies = await axios.get(
        `https://api.themoviedb.org/3/${type}/movie`,
        { params }
      );
      
      // Fetch TV series
      const requestTv = await axios.get(
        `https://api.themoviedb.org/3/${type}/tv`,
        { params }
      );
      
      // Combine results and add a type property to distinguish between movies and TV
      const movieResults = requestMovies.data.results.map(item => ({
        ...item,
        media_type: 'movie'
      }));
      
      const tvResults = requestTv.data.results.map(item => ({
        ...item,
        media_type: 'tv'
      }));
      
      // Combine and sort by popularity
      const combinedResults = [...movieResults, ...tvResults].sort((a, b) => {
        return b.popularity - a.popularity;
      });
      
      console.log("Combined and sorted results:", combinedResults.length);
      
      setMovies(combinedResults);
      
      // Set searching state to true when we have search results
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

  // Create a debounced version of fetchMovies
  // This will only execute after the user stops typing for 300ms
  const debouncedFetchMovies = useCallback(
    debounce((searchTerm) => {
      fetchMovies(searchTerm);
    }, 300),
    []
  );

  // Effect to trigger search on searchKey change
  useEffect(() => {
    if (searchKey.trim() !== '') {
      debouncedFetchMovies(searchKey);
    } else if (searchKey === '') {
      // If search is cleared, reset results
      setMovies([]);
      setIsSearching(false);
    }
  }, [searchKey, debouncedFetchMovies]);

  // Handle search key change
  const handleSearchKeyChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    
    // If input is empty, reset search
    if (value === '') {
      setIsSearching(false);
    } else {
      // Otherwise, ensure we're in searching mode
      setIsSearching(true);
    }
  };

  // Toggle search bar function
  const toggleSearchBar = (show) => {
    console.log("Setting showSearchBar to", show);
    setShowSearchBar(show);
    
    // Additional logic
    if (!show) {
      setIsSearching(false);
      setSearchKey('');
      setMovies([]);
    }
  };

  // Handle search submit - now mainly for form submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    // We don't need to call fetchMovies here anymore since it's automatically triggered by the effect
  };

  // The value to be provided by this context
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