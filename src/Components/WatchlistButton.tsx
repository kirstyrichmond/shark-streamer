import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { addToWatchlist, removeFromWatchlist, selectWatchlist, selectSelectedProfile } from "../store/slices/userSlice";
import { WatchlistButtonContainer, WatchlistIcon } from "../styles/WatchlistButton.styles";
import { getMovieType, Movie } from "../utils/movieUtils";
import { useAppDispatch } from "../app/store";

export const WatchlistButton = ({ movie }: { movie: Movie }) => {
  const dispatch = useAppDispatch();
  const watchlist = useSelector(selectWatchlist);
  const selectedProfile = useSelector(selectSelectedProfile);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (watchlist.items && movie?.id) {
      const inWatchlist = watchlist.items.some((item) => item.movie_id === movie.id?.toString());
      setIsInWatchlist(inWatchlist);
    }
  }, [watchlist.items, movie?.id]);

  const handleWatchlistToggle = async () => {
    if (!selectedProfile || !movie?.id) return;

    setLoading(true);
    try {
      const movieData = {
        movie_id: movie.id.toString(),
        title: movie.title || movie.name || "",
        poster_path: movie.poster_path || "",
        movie_poster: movie.poster_path,
        movie_title: movie.title || movie.name,
        overview: movie.overview || "",
        release_date: movie.release_date || movie.first_air_date || "",
        movie_type: getMovieType(movie),
      };

      if (isInWatchlist) {
        await dispatch(
          removeFromWatchlist({
            profileId: selectedProfile.id,
            movieId: movie.id.toString(),
          })
        ).unwrap();
      } else {
        await dispatch(
          addToWatchlist({
            profileId: selectedProfile.id,
            movieId: movie.id.toString(),
            movieData,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProfile) return null;

  return (
    <WatchlistButtonContainer onClick={ handleWatchlistToggle } disabled={ loading } $isInWatchlist={ isInWatchlist }>
      <WatchlistIcon $isInWatchlist={ isInWatchlist }>{ isInWatchlist ? <TiTick /> : <FaPlus /> }</WatchlistIcon>
    </WatchlistButtonContainer>
  );
};
