import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext"; // Import the search context hook
import MovieCard from "./MovieCard";
import styled, { keyframes } from "styled-components";
import { MovieModal } from "./MovieModal";

const SearchScreen = () => {
  // Use the search context
  const { movies, searchKey, isLoading } = useSearch();
  const [counts, setCounts] = useState({ movies: 0, tv: 0, total: 0 });
  const [filter, setFilter] = useState('all'); // 'all', 'movie', or 'tv'
  
  // Movie selection and modal state - managed locally
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openMovieModal, setOpenMovieModal] = useState(false);
  
  // Update counts when movies change
  useEffect(() => {
    const movieCount = movies.filter(item => item.media_type === 'movie' || item.title).length;
    const tvCount = movies.filter(item => item.media_type === 'tv' || (!item.title && item.name)).length;
    
    setCounts({
      movies: movieCount,
      tv: tvCount,
      total: movies.length
    });
  }, [movies]);
  
  // Filter the movies based on the current filter
  const filteredMovies = movies.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'movie') return item.media_type === 'movie' || item.title;
    if (filter === 'tv') return item.media_type === 'tv' || (!item.title && item.name);
    return true;
  });

  // Handle movie card click
  const handleMovieClick = (movie) => {
    console.log('Selected movie:', movie);
    setSelectedMovie(movie);
    setOpenMovieModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenMovieModal(false);
    // Give it a little time to properly unmount before clearing selected movie
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  };

  // Determine fetch URL for the modal based on selected movie type
  const getFetchUrl = () => {
    if (!selectedMovie) return "";
    
    // Check if it's a TV show
    if (selectedMovie.media_type === 'tv' || (!selectedMovie.title && selectedMovie.name)) {
      return `https://api.themoviedb.org/3/tv/${selectedMovie.id}`;
    }
    // Default to movie
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
                isActive={filter === 'all'} 
                onClick={() => setFilter('all')}
              >
                All ({counts.total})
              </FilterButton>
              <FilterButton 
                isActive={filter === 'movie'} 
                onClick={() => setFilter('movie')}
              >
                Movies ({counts.movies})
              </FilterButton>
              <FilterButton 
                isActive={filter === 'tv'} 
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

const Container = styled.div`
  padding: 0 60px;
  padding-top: 100px;
  min-height: 50vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #e50914;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const FilterButton = styled.button`
  background-color: ${props => props.isActive ? '#e50914' : '#333'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '#e50914' : '#444'};
  }
`;

const ResultsCount = styled.div`
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 25px;
`;

export default SearchScreen;