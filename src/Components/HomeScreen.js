import React from "react";
import requests from "../Requests";

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
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      />
      <Row
        title="Trending Now"
        fetchUrl={requests.fetchTrending}
      />
      <Row
        title="Top Rated"
        fetchUrl={requests.fetchTopRated}
      />
      <Row
        title="Action Movies"
        fetchUrl={requests.fetchActionMovies}
      />
      <Row
        title="Comedy Movies"
        fetchUrl={requests.fetchComedyMovies}
      />
      <Row
        title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
      />
      <Row
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <Row
        title="Documentaries"
        fetchUrl={requests.fetchDocumentaries}
      />
    </>
  );
};
