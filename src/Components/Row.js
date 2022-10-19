import axios from "../axios";
import React, { useEffect, useState } from "react";
import { MovieModal } from "./MovieModal";
import {
  Container,
  MovieContainer,
  MovieImage,
  Title,
} from "../styles/Row.styles";

export const Row = ({
  title,
  fetchUrl,
  selectedMovie,
  setSelectedMovie,
  isLargeRow = false,
}) => {
  const [movies, setMovies] = useState([]);
  const [openMovieModal, setOpenMovieModal] = useState(false);

  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <>
      <MovieModal
        selectedMovie={selectedMovie}
        isOpen={openMovieModal}
        handleClose={setOpenMovieModal}
        fetchUrl={fetchUrl}
      />
      <Container>
        <Title>{title}</Title>
        <MovieContainer>
          {movies.map(
            (movie) =>
              ((isLargeRow && movie.poster_path) ||
                (!isLargeRow && movie.backdrop_path)) && (
                <MovieImage
                  large={isLargeRow}
                  key={movie.id}
                  src={`${base_url}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                  onClick={() => {
                    setOpenMovieModal(true);
                    setSelectedMovie(movie);
                  }}
                />
              )
          )}
        </MovieContainer>
      </Container>
    </>
  );
};
