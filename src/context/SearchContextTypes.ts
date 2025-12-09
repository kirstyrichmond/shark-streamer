import React, { createContext } from "react";

export interface Movie {
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
