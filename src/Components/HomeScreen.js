import React from "react";
import requests from "../Requests";

import { Banner } from "./Banner";
import { Row } from "./Row";

export const HomeScreen = ({ selectedMovie, setSelectedMovie }) => {
  return (
    <>
      <Banner />
      <Row
        title="NETFLIX ORIGINALS"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Trending Now"
        fetchUrl={requests.fetchTrending}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Top Rated"
        fetchUrl={requests.fetchTopRated}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Action Movies"
        fetchUrl={requests.fetchActionMovies}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Comedy Movies"
        fetchUrl={requests.fetchComedyMovies}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
      <Row
        title="Documentaries"
        fetchUrl={requests.fetchDocumentaries}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
      />
    </>
  );
};
