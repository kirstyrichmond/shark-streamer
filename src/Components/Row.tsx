import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MovieModal } from "./MovieModal";
import { RowErrorBoundary, MovieModalErrorBoundary, ImageErrorBoundary } from "./ErrorBoundary";
import {
  fetchWatchlist,
  selectWatchlistLoading,
  selectSortedWatchlistItems,
  selectSelectedProfile,
  openModal,
  closeModal,
  WatchlistItem,
} from "../store/slices/userSlice";
import { movieAPI } from "../services/api";
import { getMovieType, Movie } from "../utils/movieUtils";
import { useMovieFiltering } from "../hooks/useMovieFiltering";
import "react-loading-skeleton/dist/skeleton.css";
import { Container, PosterLarge, Posters, RowContainer, Title, ResponsiveSkeleton } from "../styles/Row.styles";
import { useAppDispatch } from "../app/store";
import { useSelector } from "react-redux";

type RowProps = {
  title: string;
  fetchRequest?: () => Promise<{ data: { results: Movie[] } }>;
  isLargeRow?: boolean;
  isWatchlist?: boolean;
};

interface MovieDetailsResponse {
  data: Movie;
}

const Row: React.FC<RowProps> = ({ title, fetchRequest, isLargeRow = false, isWatchlist = false }) => {
  const dispatch = useAppDispatch();
  const watchlistItems = useSelector(selectSortedWatchlistItems);
  const watchlistLoading = useSelector(selectWatchlistLoading);
  const selectedProfile = useSelector(selectSelectedProfile);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | WatchlistItem | null>(null);
  const [openMovieModal, setOpenMovieModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  const { filterMovies, isFiltering } = useMovieFiltering();

  useEffect(() => {
    if (isWatchlist) {
      if (selectedProfile?.id) {
        dispatch(fetchWatchlist(selectedProfile.id));
      }
    } else {
      const fetchData = async () => {
        try {
          if (fetchRequest) {
            const request = await fetchRequest();
            const rawMovies = request.data.results;

            const validMovies = await filterMovies(rawMovies, {
              isLargeRow,
            });
            setFilteredMovies(validMovies);
            setLoading(false);
            return request;
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching row data:", error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [fetchRequest, isWatchlist, dispatch, selectedProfile?.id, filterMovies, isLargeRow]);

  useEffect(() => {
    if (isWatchlist) {
      setTimeout(() => setLoading(watchlistLoading), 0);
    }
  }, [isWatchlist, watchlistLoading]);

  const showMovieModal = useCallback(
    (movieData: Movie | WatchlistItem) => {
      setSelectedMovie(movieData);
      setOpenMovieModal(true);
      dispatch(openModal());
    },
    [dispatch]
  );

  const handleClick = useCallback(
    async (item: Movie) => {
      if (isWatchlist) {
        try {
          const movieType: "tv" | "movie" = item.movie_type === "tv" ? "tv" : "movie";
          if (!item.movie_id) {
            console.error("Movie ID is undefined");
            return;
          }
          const response: MovieDetailsResponse = await movieAPI.fetchMovieDetails(movieType, item.movie_id);

          const movieData: Movie = {
            ...response.data,
            media_type: item.movie_type,
          };

          showMovieModal(movieData);
        } catch (error) {
          console.error("Error fetching movie details:", error);
          alert("Error loading movie details. Please try again.");
        }
      } else {
        showMovieModal(item);
      }
    },
    [isWatchlist, showMovieModal]
  );

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

    return filteredMovies || [];
  }, [isWatchlist, watchlistItems, filteredMovies]);

  if (isWatchlist && !loading && displayData.length === 0) {
    return null;
  }

  return (
    <RowErrorBoundary>
      <Container>
        <Title>{ title }</Title>
        <RowContainer>
          <Posters>
            { loading || isFiltering
              ? Array.from({ length: isWatchlist ? 5 : 12 }).map((_, index) => (
                  <div key={ `skeleton-${index}` }>
                    <ResponsiveSkeleton baseColor="#202020" highlightColor="#444" />
                  </div>
                ))
              : displayData.map((item: Movie | WatchlistItem) => {
                  const itemId = isWatchlist ? item.id : item.id;
                  const posterPath = isWatchlist ? item.movie_poster : item.poster_path;
                  const altText = isWatchlist ? item.movie_title : item.name || item.title;

                  return (
                    <ImageErrorBoundary key={ itemId }>
                      <div style={ { marginTop: "10px" } }>
                        { itemId && !loadedImages[itemId] && (
                          <ResponsiveSkeleton baseColor="#202020" highlightColor="#444" />
                        ) }
                        <PosterLarge
                          onClick={ () => handleClick(item) }
                          src={ `https://image.tmdb.org/t/p/original${isWatchlist ? "" : "/"}${posterPath}` }
                          alt={ altText }
                          onLoad={ () => {
                            if (itemId) {
                              setLoadedImages((prev) => ({ ...prev, [itemId]: true }));
                            }
                          } }
                          onError={ (e) => {
                            console.error("Image failed to load:", (e.target as HTMLImageElement).src);
                            // Optionally set a fallback image
                            // e.target.src = '/path/to/fallback-image.jpg';
                          } }
                          style={ { display: itemId && loadedImages[itemId] ? "block" : "none" } }
                        />
                      </div>
                    </ImageErrorBoundary>
                  );
                }) }
          </Posters>
        </RowContainer>
        { selectedMovie && (
          <MovieModalErrorBoundary>
            <MovieModal
              isOpen={ openMovieModal }
              handleClose={ handleCloseModal }
              selectedMovie={ selectedMovie }
              fetchUrl={
                isWatchlist ? (selectedMovie.media_type === "tv" ? "tv" : "movie") : getMovieType(selectedMovie)
              }
              onMovieChange={ (newMovie: WatchlistItem | Movie) => {
                setSelectedMovie(newMovie);
              } }
            />
          </MovieModalErrorBoundary>
        ) }
      </Container>
    </RowErrorBoundary>
  );
};

export default React.memo(Row);
