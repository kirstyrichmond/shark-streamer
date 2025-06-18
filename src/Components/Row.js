import React, { useEffect, useState } from "react";
import axios from "../axios";
import { MovieModal } from "./MovieModal";
import { 
  Container, 
  PosterImage, 
  PosterLarge, 
  Posters, 
  RowContainer, 
  Title 
} from "../styles/Row.styles";

export const Row = ({
  title,
  fetchUrl,
  isLargeRow = false,
}) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openMovieModal, setOpenMovieModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      } catch (error) {
        console.error("Error fetching row data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    setSelectedMovie(movie);
    setOpenMovieModal(true);
  };

  const handleCloseModal = () => {
    setOpenMovieModal(false);
    // Give it a little time to properly unmount
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  };

  return (
    <Container>
      <Title>{title}</Title>
      <RowContainer>
        <Posters>
          {movies?.map(
            (movie) =>
              ((isLargeRow && movie.poster_path) ||
                (!isLargeRow && movie.backdrop_path)) && (
                <div key={movie.id}>
                  {/* {isLargeRow ? ( */}
                    <PosterLarge
                      onClick={() => handleClick(movie)}
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.name || movie.title}
                    />
                </div>
              )
          )}
        </Posters>
      </RowContainer>
      
      {selectedMovie && (
        <MovieModal
          isOpen={openMovieModal}
          handleClose={handleCloseModal}
          selectedMovie={selectedMovie}
          fetchUrl={fetchUrl}
        />
      )}
    </Container>
  );
};
