import React, { useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Container,
  Image,
} from "../styles/MovieCard.styles";
import { getImageUrl, getMovieTitle } from "../utils/movieUtils";

const MovieCard = ({ movie, onClick, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    onClick?.(movie);
  };

  const imageSrc = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');

  return (
    <Container
      onClick={handleClick}
      $isSelected={isSelected}
    >
      {!imageLoaded && (
        <Skeleton 
          height="100%"
          baseColor="#202020"
          highlightColor="#444"
        />
      )}
      <Image
        src={imageSrc}
        alt={getMovieTitle(movie)}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
        style={{ opacity: imageLoaded ? 1 : 0 }}
      />
    </Container>
  );
};


export default React.memo(MovieCard, (prevProps, nextProps) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onClick === nextProps.onClick
  );
});