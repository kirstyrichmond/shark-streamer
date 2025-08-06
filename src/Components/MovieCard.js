import React, { useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Container,
  Image,
  NoImage,
  NoImageText,
  // Info,
  // TitleContainer,
  // Title,
  // MediaType,
  // Overview,
  // RatingContainer,
  // Rating,
  // ReleaseDate,
} from "../styles/MovieCard.styles";

const MovieCard = ({ movie, onClick, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const BASE_URL = "https://image.tmdb.org/t/p/original/";

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };
  
  const isMovie = movie.media_type === 'movie' || movie.title;
  const isTV = movie.media_type === 'tv' || movie.name;
  
  const getTitle = () => {
    if (isMovie) return movie.title;
    if (isTV) return movie.name;
    return movie.original_name || 'Unknown Title';
  };
  
  // const getYear = () => {
  //   if (isMovie && movie.release_date) return movie.release_date.substring(0, 4);
  //   if (isTV && movie.first_air_date) return movie.first_air_date.substring(0, 4);
  //   return 'N/A';
  // };

  return (
    <Container
      onClick={handleClick}
      isSelected={isSelected}
    >
      {movie.backdrop_path || movie.poster_path ? (
        <>
          {!imageLoaded && (
            <Skeleton 
              height="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
          )}
          <Image
            src={`${BASE_URL}${movie.poster_path || movie.backdrop_path}`}
            alt={getTitle()}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        </>
      ) : (
        <NoImage>
          <NoImageText>No Image Available</NoImageText>
        </NoImage>
      )}
      {/* <Info isHovered={isHovered}> */}
        {/* <TitleContainer>
          <Title>{getTitle()}</Title>
          <MediaType>{isMovie ? 'Movie' : 'TV'}</MediaType>
        </TitleContainer> */}
        
        {/* {isHovered && (
          <Overview>
            {movie.overview?.length > 150
              ? `${movie.overview.substring(0, 150)}...`
              : movie.overview || 'No description available'}
          </Overview>
        )}
        {isHovered && (
          <RatingContainer>
            <Rating>{movie.vote_average?.toFixed(1)}/10</Rating>
            <ReleaseDate>{getYear()}</ReleaseDate>
          </RatingContainer>
        )} */}
      {/* </Info> */}
    </Container>
  );
};


export default MovieCard;