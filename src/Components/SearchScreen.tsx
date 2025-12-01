import { useState, useCallback } from "react";
import { useSearch } from "../hooks/useSearch";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getApiUrl, Movie } from "../utils/movieUtils";
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openMovieModal, setOpenMovieModal] = useState<boolean>(false);

  useInfiniteScroll(loadMoreMovies, {
    hasNextPage,
    isLoading: isLoadingMore,
    threshold: 1000,
  });

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setOpenMovieModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenMovieModal(false);
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  }, []);

  return (
    <>
      <Container>
        { movies.length < 1 ? (
          <NoResultsContainer>
            <NoResultsTitle>No results found</NoResultsTitle>
            <NoResultsMessage>
              We couldn't find any movies or TV shows matching your search.
            </NoResultsMessage>
          </NoResultsContainer>
        ) : (
          <Content>
            { movies.map((movie) => (
              <MovieCard
                key={ movie.id }
                movie={ movie }
                onClick={ () => handleMovieClick(movie) }
                isSelected={ selectedMovie?.id === movie.id }
              />
            )) }
          </Content>
        ) }
      </Container>
      { selectedMovie && (
        <MovieModal
          isOpen={ openMovieModal }
          handleClose={ handleCloseModal }
          selectedMovie={ selectedMovie }
          fetchUrl={ getApiUrl(selectedMovie) }
        />
      ) }
    </>
  );
};

export default SearchScreen;
