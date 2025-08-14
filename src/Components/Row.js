import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MovieModal } from "./MovieModal";
import { fetchWatchlist, selectWatchlist, selectSelectedProfile } from "../features/userSlice";
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

export const Row = ({
  title,
  fetchRequest,
  isLargeRow = false,
  isWatchlist = false,
}) => {
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);
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
      setLoading(watchlist?.loading ?? true);
    }
  }, [isWatchlist, watchlist?.loading]);

  const handleClick = async (item) => {
    console.log({ item });
    
    if (isWatchlist) {
      try {
        const movieType = item.movie_type === 'tv' ? 'tv' : 'movie';
        const response = await movieAPI.fetchMovieDetails(movieType, item.movie_id);
        
        const movieData = {
          ...response.data,
          media_type: item.movie_type
        };
        
        setSelectedMovie(movieData);
        setOpenMovieModal(true);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Error loading movie details. Please try again.');
      }
    } else {
      setSelectedMovie(item);
      setOpenMovieModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenMovieModal(false);
    setTimeout(() => {
      setSelectedMovie(null);
    }, 300);
  };

  const sortWatchlistByDate = (items) => {
    return [...items].sort((a, b) => {
      const dateComparison = new Date(b.added_at) - new Date(a.added_at);
      return dateComparison !== 0 ? dateComparison : b.id - a.id;
    });
  };

  const getDisplayData = () => {
    if (isWatchlist) {
      const items = watchlist?.items || [];
      return sortWatchlistByDate(items);
    }
    
    return movies?.filter(movie => 
      (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)
    ) || [];
  };

  const displayData = getDisplayData();
  
  if (isWatchlist && !loading && displayData.length === 0) {
    return null;
  }

  return (
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
                <div key={itemId} style={{ marginTop: '10px'}}>
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
                    style={{ display: loadedImages[itemId] ? 'block' : 'none' }}
                  />
                </div>
              );
            })
          )}
        </Posters>
      </RowContainer>
      {selectedMovie && (
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
      )}
    </Container>
  );
};
