import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import MovieCard from "./MovieCard";
import { MovieModal } from "./MovieModal";
import {
  Container,
  LoadingContainer,
  LoadingText,
  LoadingSpinner,
  HeaderContainer,
  HeaderTitle,
  FilterContainer,
  FilterButton,
  ResultsCount,
  Content,
} from "../styles/SearchScreen.styles";

const SearchScreen = () => {
  const { movies, searchKey, isLoading } = useSearch();
  const [counts, setCounts] = useState({ movies: 0, tv: 0, total: 0 });
  const [filter, setFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openMovieModal, setOpenMovieModal] = useState(false);
  
  useEffect(() => {
    const movieCount = movies.filter(item => item.media_type === 'movie' || item.title).length;
    const tvCount = movies.filter(item => item.media_type === 'tv' || (!item.title && item.name)).length;
    
    setCounts({
      movies: movieCount,
      tv: tvCount,
      total: movies.length
    });
  }, [movies]);
  
  const filteredMovies = movies.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'movie') return item.media_type === 'movie' || item.title;
    if (filter === 'tv') return item.media_type === 'tv' || (!item.title && item.name);
    return true;
  });

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setOpenMovieModal(true);
  };

  const handleCloseModal = () => {
    setOpenMovieModal(false);
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  };

  const getFetchUrl = () => {
    if (!selectedMovie) return "";
    
    if (selectedMovie.media_type === 'tv' || (!selectedMovie.title && selectedMovie.name)) {
      return `https://api.themoviedb.org/3/tv/${selectedMovie.id}`;
    }
    return `https://api.themoviedb.org/3/movie/${selectedMovie.id}`;
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>Searching for "{searchKey}"</LoadingText>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          <HeaderTitle>
            {movies.length > 0 
              ? `Search results for: "${searchKey}"`
              : `No results found for: "${searchKey}"`}
          </HeaderTitle>
          {movies.length > 0 && (
            <FilterContainer>
              <FilterButton 
                $isActive={filter === 'all'} 
                onClick={() => setFilter('all')}
              >
                All ({counts.total})
              </FilterButton>
              <FilterButton 
                $isActive={filter === 'movie'} 
                onClick={() => setFilter('movie')}
              >
                Movies ({counts.movies})
              </FilterButton>
              <FilterButton 
                $isActive={filter === 'tv'} 
                onClick={() => setFilter('tv')}
              >
                TV Shows ({counts.tv})
              </FilterButton>
            </FilterContainer>
          )}
        </HeaderContainer>
        {movies.length > 0 && (
          <ResultsCount>
            Showing {filteredMovies.length} results sorted by popularity
          </ResultsCount>
        )}
        <Content>
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
              isSelected={selectedMovie?.id === movie.id}
            />
          ))}
        </Content>
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