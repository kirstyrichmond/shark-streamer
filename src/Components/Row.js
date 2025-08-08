import React, { useEffect, useState } from "react";
import axios from "../axios";
import { MovieModal } from "./MovieModal";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  Container, 
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
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        setLoading(false);
        return request;
      } catch (error) {
        console.error("Error fetching row data:", error);
        setLoading(false);
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
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  };

  return (
    <Container>
      <Title>{title}</Title>
      <RowContainer>
        <Posters>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`}>
                <Skeleton
                  height={250}
                  width={166}
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </div>
            ))
          ) : (
            movies?.map(
              (movie) =>
                ((isLargeRow && movie.poster_path) ||
                  (!isLargeRow && movie.backdrop_path)) && (
                  <div key={movie.id} style={{ marginTop: '10px'}}>
                    {!loadedImages[movie.id] && (
                      <Skeleton
                        height={250}
                        width={166}
                        baseColor="#202020"
                        highlightColor="#444"
                      />
                    )}
                    <PosterLarge
                      onClick={() => handleClick(movie)}
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.name || movie.title}
                      onLoad={() => setLoadedImages(prev => ({...prev, [movie.id]: true}))}
                      style={{ display: loadedImages[movie.id] ? 'block' : 'none' }}
                    />
                  </div>
                )
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
          onMovieChange={(newMovie) => {
            setSelectedMovie(newMovie);
          }}
        />
      )}
    </Container>
  );
};
