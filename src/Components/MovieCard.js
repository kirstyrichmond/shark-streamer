import React, { useState } from "react";
import styled from "styled-components";

const MovieCard = ({ movie, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const BASE_URL = "https://image.tmdb.org/t/p/original/";

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };
  
  // Determine the type of content (movie or TV show)
  const isMovie = movie.media_type === 'movie' || movie.title;
  const isTV = movie.media_type === 'tv' || movie.name;
  
  // Get the proper title based on content type
  const getTitle = () => {
    if (isMovie) return movie.title;
    if (isTV) return movie.name;
    return movie.original_name || 'Unknown Title';
  };
  
  // Get the release date or first air date
  const getYear = () => {
    if (isMovie && movie.release_date) return movie.release_date.substring(0, 4);
    if (isTV && movie.first_air_date) return movie.first_air_date.substring(0, 4);
    return 'N/A';
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      isSelected={isSelected}
    >
      {movie.backdrop_path || movie.poster_path ? (
        <Image
          src={`${BASE_URL}${movie.poster_path || movie.backdrop_path}`}
          alt={getTitle()}
        />
      ) : (
        <NoImage>
          <NoImageText>No Image Available</NoImageText>
        </NoImage>
      )}
      
      <Info isHovered={isHovered}>
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
      </Info>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 200px;
  background-color: #111;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  
  ${props => props.isSelected && `
    border: 2px solid #e50914;
  `}
`;

const Image = styled.img`
  // width: 100%;
  // height: 100%;
  // object-fit: cover;

  max-height: 250px;
  object-fit: contain;
  margin-right: 15px;
  transition: transform 450ms;
  cursor: pointer;

  &:hover {
    transform: scale(1.09);
    opacity: 1;
  }

  @media (max-width: 768px) {
    max-height: 140px;
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoImageText = styled.p`
  color: #999;
  font-size: 14px;
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2), transparent);
  transition: height 0.3s ease;
  height: ${props => (props.isHovered ? "100%" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  color: white;
  font-size: 14px;
  margin: 0;
  font-weight: 700;
  flex: 1;
`;

const MediaType = styled.span`
  color: #999;
  font-size: 10px;
  border: 1px solid #999;
  padding: 1px 4px;
  border-radius: 3px;
`;

const Overview = styled.p`
  color: #ddd;
  font-size: 12px;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const Rating = styled.span`
  color: #46d369;
  font-size: 12px;
  font-weight: bold;
`;

const ReleaseDate = styled.span`
  color: #ccc;
  font-size: 12px;
`;

export default MovieCard;