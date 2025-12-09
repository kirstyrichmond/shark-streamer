import React, { useState, useCallback, useMemo, useEffect, ReactNode } from "react";
import { debounce } from "lodash";
import { SearchContext, SearchContextType, SearchKeyChangeEvent } from "./SearchContextTypes";
import { useSearchQuery } from "../hooks/useSearchQuery";

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [debouncedSearchKey, setDebouncedSearchKey] = useState<string>("");

  const { movies, hasNextPage, isLoading, isLoadingMore, loadMoreMovies } = useSearchQuery(debouncedSearchKey);

  const debouncedSetSearchKey = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearchKey(value);
    }, 300),
    []
  );

  const isSearching = debouncedSearchKey.trim() !== "";

  useEffect(() => {
    debouncedSetSearchKey(searchKey);
  }, [searchKey, debouncedSetSearchKey]);

  const handleSearchKeyChange = useCallback(
    (e: SearchKeyChangeEvent) => {
      const value = e.target.value;
      setSearchKey(value);
    },
    []
  );

  const toggleSearchBar = useCallback(
    (show: boolean) => {
      setShowSearchBar(show);

      if (!show) {
        debouncedSetSearchKey.cancel();
        setSearchKey("");
        setDebouncedSearchKey("");
      }
    },
    [debouncedSetSearchKey]
  );

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
  }, []);

  const value: SearchContextType = useMemo(
    () => ({
      searchKey,
      setSearchKey,
      handleSearchKeyChange,
      showSearchBar,
      toggleSearchBar,
      isSearching,
      movies,
      isLoading,
      handleSearchSubmit,
      hasNextPage,
      isLoadingMore,
      loadMoreMovies: async () => {
        await loadMoreMovies();
      },
    }),
    [
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
      loadMoreMovies,
    ]
  );

  return <SearchContext.Provider value={ value }>{ children }</SearchContext.Provider>;
};
