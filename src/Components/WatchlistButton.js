import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { addToWatchlist, removeFromWatchlist, selectWatchlist, selectSelectedProfile } from '../features/userSlice';
import { WatchlistButtonContainer, WatchlistIcon } from '../styles/WatchlistButton.styles';
import { getMovieType } from '../utils/movieUtils';

export const WatchlistButton = ({ movie }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);
  const selectedProfile = useSelector(selectSelectedProfile);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (watchlist.items && movie?.id) {
      const inWatchlist = watchlist.items.some(item => item.movie_id === movie.id.toString());
      setIsInWatchlist(inWatchlist);
    }
  }, [watchlist.items, movie?.id]);

  const handleWatchlistToggle = async () => {
    if (!selectedProfile || !movie?.id) return;
    
    setLoading(true);
    try {      
      const movieData = {
        movie_title: movie.title || movie.name,
        movie_poster: movie.poster_path,
        movie_type: getMovieType(movie)
      };

      if (isInWatchlist) {
        await dispatch(removeFromWatchlist({
          profileId: selectedProfile.id,
          movieId: movie.id.toString()
        })).unwrap();
      } else {
        await dispatch(addToWatchlist({
          profileId: selectedProfile.id,
          movieId: movie.id.toString(),
          movieData
        })).unwrap();
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProfile) return null;

  return (
    <WatchlistButtonContainer 
      onClick={handleWatchlistToggle}
      disabled={loading}
      $isInWatchlist={isInWatchlist}
    >
      <WatchlistIcon $isInWatchlist={isInWatchlist}>
        {isInWatchlist ? <TiTick /> : <FaPlus />}
      </WatchlistIcon>
    </WatchlistButtonContainer>
  );
};