import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MovieModal } from "./MovieModal";
import { RowErrorBoundary, MovieModalErrorBoundary, ImageErrorBoundary } from "./ErrorBoundary";
import { 
  fetchWatchlist, 
  selectWatchlistLoading, 
  selectSortedWatchlistItems,
  selectSelectedProfile, 
  openModal, 
  closeModal 
} from "../features/userSlice";
import { movieAPI } from "../services/api";
import { getMovieType } from "../utils/movieUtils";
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  Container, 
  PosterLarge, 
  Posters, 
  RowContainer, 
  Title,
  ResponsiveSkeleton
} from "../styles/Row.styles";

const Row = ({
  title,
  fetchRequest,
  isLargeRow = false,
  isWatchlist = false,
}) => {
  const dispatch = useDispatch();
  const watchlistItems = useSelector(selectSortedWatchlistItems);
  const watchlistLoading = useSelector(selectWatchlistLoading);
  const selectedProfile = useSelector(selectSelectedProfile);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openMovieModal, setOpenMovieModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    if (isWatchlist) {
      if (selectedProfile?.id) {
        dispatch(fetchWatchlist(selectedProfile.id));
      }
    } else {
      async function fetchData() {
        try {
          const request = await fetchRequest();
          setMovies(request.data.results);
          setLoading(false);
          return request;
        } catch (error) {
          console.error("Error fetching row data:", error);
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [fetchRequest, isWatchlist, dispatch, selectedProfile?.id]);

  useEffect(() => {
    if (isWatchlist) {
      setLoading(watchlistLoading);
    }
  }, [isWatchlist, watchlistLoading]);

  const showMovieModal = useCallback((movieData) => {
    setSelectedMovie(movieData);
    setOpenMovieModal(true);
    dispatch(openModal());
  }, [dispatch]);

  const handleClick = useCallback(async (item) => {
    if (isWatchlist) {
      try {
        const movieType = item.movie_type === 'tv' ? 'tv' : 'movie';
        const response = await movieAPI.fetchMovieDetails(movieType, item.movie_id);
        
        const movieData = {
          ...response.data,
          media_type: item.movie_type
        };
        
        showMovieModal(movieData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Error loading movie details. Please try again.');
      }
    } else {
      showMovieModal(item);
    }
  }, [isWatchlist, showMovieModal]);

  const handleCloseModal = useCallback(() => {
    setOpenMovieModal(false);
    dispatch(closeModal());
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  }, [dispatch]);

  const displayData = useMemo(() => {
    if (isWatchlist) {
      return watchlistItems;
    }

    return movies?.filter(movie =>
      (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)
    ) || [];
  }, [isWatchlist, watchlistItems, movies, isLargeRow]);
  
  if (isWatchlist && !loading && displayData.length === 0) {
    return null;
  }

  return (
    <RowErrorBoundary>
      <Container>
        <Title>{title}</Title>
        <RowContainer>
          <Posters>
            {loading ? (
              Array.from({ length: isWatchlist ? 5 : 8 }).map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <ResponsiveSkeleton
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>
              ))
            ) : (
              displayData.map((item) => {
                const itemId = isWatchlist ? item.id : item.id;
                const posterPath = isWatchlist ? item.movie_poster : item.poster_path;
                const altText = isWatchlist ? item.movie_title : (item.name || item.title);
                
                return (
                  <ImageErrorBoundary key={itemId}>
                    <div style={{ marginTop: '10px'}}>
                      {!loadedImages[itemId] && (
                        <ResponsiveSkeleton
                          baseColor="#202020"
                          highlightColor="#444"
                        />
                      )}
                      <PosterLarge
                        onClick={() => handleClick(item)}
                        src={`https://image.tmdb.org/t/p/original${isWatchlist ? '' : '/'}${posterPath}`}
                        alt={altText}
                        onLoad={() => setLoadedImages(prev => ({...prev, [itemId]: true}))}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          // Optionally set a fallback image
                          // e.target.src = '/path/to/fallback-image.jpg';
                        }}
                        style={{ display: loadedImages[itemId] ? 'block' : 'none' }}
                      />
                    </div>
                  </ImageErrorBoundary>
                );
              })
            )}
          </Posters>
        </RowContainer>
        {selectedMovie && (
          <MovieModalErrorBoundary>
            <MovieModal
              isOpen={openMovieModal}
              handleClose={handleCloseModal}
              selectedMovie={selectedMovie}
              fetchUrl={isWatchlist ? 
                (selectedMovie.media_type === 'tv' ? 'tv' : 'movie') : 
                getMovieType(selectedMovie)
              }
              onMovieChange={(newMovie) => {
                setSelectedMovie(newMovie);
              }}
            />
          </MovieModalErrorBoundary>
        )}
      </Container>
    </RowErrorBoundary>
  );
};

export default React.memo(Row);
