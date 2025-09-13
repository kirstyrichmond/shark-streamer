import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../context/SearchContext";
import MovieCard from "./MovieCard";
import { MovieModal } from "./MovieModal";
import {
  Container,
  Content,
  NoResultsContainer,
  NoResultsTitle,
  NoResultsMessage,
} from "../styles/SearchScreen.styles";

const SearchScreen = () => {
  const { movies, hasNextPage, isLoadingMore, loadMoreMovies } = useSearch();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openMovieModal, setOpenMovieModal] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasNextPage) {
        return;
      }
      
      const scrolledNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000;
      
      if (scrolledNearBottom) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isLoadingMore, loadMoreMovies]);
  

  const handleMovieClick = useCallback((movie) => {
    setSelectedMovie(movie);
    setOpenMovieModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenMovieModal(false);
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  }, []);

  const getFetchUrl = () => {
    if (!selectedMovie) return "";
    
    if (selectedMovie.media_type === 'tv' || (!selectedMovie.title && selectedMovie.name)) {
      return `https://api.themoviedb.org/3/tv/${selectedMovie.id}`;
    }
    return `https://api.themoviedb.org/3/movie/${selectedMovie.id}`;
  };

  return (
    <>
      <Container>
        {movies.length < 1 ? (
          <NoResultsContainer>
            <NoResultsTitle>No results found</NoResultsTitle>
            <NoResultsMessage>
              We couldn't find any movies or TV shows matching your search.
            </NoResultsMessage>
          </NoResultsContainer>
        ) : (
          <Content>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
                isSelected={selectedMovie?.id === movie.id}
              />
            ))}
          </Content>
        )}
      </Container>
      {selectedMovie && (
        <MovieModal
          isOpen={openMovieModal}
          handleClose={handleCloseModal}
          selectedMovie={selectedMovie}
          fetchUrl={getFetchUrl()}
        />
      )}
    </>
  );
};

export default SearchScreen;