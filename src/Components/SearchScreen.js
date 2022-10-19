import React, { useState } from "react";
import {
  SearchAllMovieContainer,
  SearchMovieContainer,
  SearchMovieImage,
  SearchMovieTitle,
} from "../styles/HomeScreen.styles";
import { MovieModal } from "./MovieModal";

const SearchScreen = ({ movies, setSelectedMovie, selectedMovie }) => {
  const [openMovieModal, setOpenMovieModal] = useState(false);

  return (
    <>
      <MovieModal
        selectedMovie={selectedMovie}
        isOpen={openMovieModal}
        handleClose={setOpenMovieModal}
      />
      <SearchAllMovieContainer>
        {movies.map((movie) => (
          <SearchMovieContainer
            onClick={() => {
              setOpenMovieModal(true);
              setSelectedMovie(movie);
            }}
            key={movie.id}
          >
            <SearchMovieImage
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt=""
            />
            {/* <SearchMovieTitle>{movie.title}</SearchMovieTitle> */}
          </SearchMovieContainer>
        ))}
      </SearchAllMovieContainer>
    </>
  );
};

export default SearchScreen;
