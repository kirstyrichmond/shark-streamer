import { useContext } from "react";
import { SearchContext, SearchContextType } from "../context/SearchContextTypes";

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
