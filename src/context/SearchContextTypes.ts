import React, { createContext } from "react";
import { Movie } from "../utils/movieUtils";

export interface SearchKeyChangeEvent {
  target: {
    value: string;
  };
}

export interface SearchContextType {
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  handleSearchKeyChange: (e: SearchKeyChangeEvent) => void;
  showSearchBar: boolean;
  toggleSearchBar: (show: boolean) => void;
  isSearching: boolean;
  movies: Movie[];
  isLoading: boolean;
  handleSearchSubmit: (e?: React.FormEvent) => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  loadMoreMovies: () => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);
