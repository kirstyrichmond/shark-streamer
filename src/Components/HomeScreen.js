import React from "react";
import { movieAPI } from "../services/api";

import { Banner } from "./Banner";
import { Row } from "./Row";
import { useSearch } from "../context/SearchContext";
import SearchScreen from "./SearchScreen";

export const HomeScreen = () => {
  const { isSearching } = useSearch();

  if (isSearching) {
    return <SearchScreen />;
  }

  return (
    <>
      <Banner />
      <Row
        title="My List"
        isWatchlist
      />
      <Row
        title="NETFLIX ORIGINALS"
        fetchRequest={movieAPI.fetchNetflixOriginals}
        isLargeRow
      />
      <Row
        title="Trending Now"
        fetchRequest={movieAPI.fetchTrending}
      />
      <Row
        title="Top Rated"
        fetchRequest={movieAPI.fetchTopRated}
      />
      <Row
        title="Action Movies"
        fetchRequest={movieAPI.fetchActionMovies}
      />
      <Row
        title="Comedy Movies"
        fetchRequest={movieAPI.fetchComedyMovies}
      />
      <Row
        title="Horror Movies"
        fetchRequest={movieAPI.fetchHorrorMovies}
      />
      <Row
        title="Romance Movies"
        fetchRequest={movieAPI.fetchRomanceMovies}
      />
      <Row
        title="Documentaries"
        fetchRequest={movieAPI.fetchDocumentaries}
      />
    </>
  );
};
