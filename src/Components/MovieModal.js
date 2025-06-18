import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import {
  CloseButton,
  CloseButtonContainer,
  HeaderContainer,
  ModalContainer,
  MovieCoverImage,
  MovieDescription,
  MovieInfoContainer,
  MovieTitle,
  PlayButton,
  PlayIcon,
  ReleaseDate,
  TrailerContainer,
  CustomMuteButton,
  MuteIcon,
  UnmuteIcon,
  PlayerWrapper,
  ModalContent,
  MovieLogo,
  ModalButtonsContainer,
  ModalPlayButton,
  ModalInfoButton,
  ModalPlayIcon,
  ModalInfoIcon,
  // New styled components we'll need to add
  ExpandedContent,
  MovieDetails,
  MovieMeta,
  CastList,
  GenreList,
  SimilarSection,
  SimilarTitle,
  SimilarGrid,
  SimilarCard,
  SimilarImage,
  SimilarCardTitle,
  SimilarCardDuration,
  TrailersSection,
  TrailerGrid,
  TrailerCard,
  TrailerThumbnail,
  TrailerTitle,
  TrailerDuration,
  MovieMetaRow,
  MetaLabel,
  MetaValue,
  AgeRating,
  Duration,
  MoreDetailsButton,
  DetailsSeparator,
  MovieInfo,
  DescriptionHeader
} from "../styles/MovieModal.styles";
import { API_KEY } from "../Requests";
import axios from "axios";

// Custom styles remain the same
const customStyles = {
  // overlay: {
  //     boxSizing: "border-box",
  //    display: "flex",
  //    justifyContent: "center",
  //    left: "0",
  //    position: "absolute",
  //    top: "0",
  //    willChange: "scroll-position",
  //    height: "100%",
  //    width: "100%",
  // },
  // content: {
  //   zIndex: "2",
  //   opacity: "1",
  //   width: "924.16px",
  //   transformOrigin: "50% 0%",
  //   transform: "translateX(0px) translateY(calc(2em - 232.998px)) scaleX(1) scaleY(1) translateZ(0px)",
  //   top: "232.998px",
  //   boxShadow: "rgba(0, 0, 0, 0.75) 0px 3px 10px",
  //   position: "inherit",
  //   left: "auto",
  //   marginBottom: "2em",
  //   minWidth: "850px",
  //   backgroundColor: "transparent",
  //   borderRadius: "6px",
  //   color: "#fff",
  //   fontSize: "16px",
  //   overflow: "hidden",
  //   position: "absolute",
  //   willChange: "transform",

  // },
  content: {
    top: "2em",
    left: "50%",
    right: "auto",
    // bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -49%)",
    inset: "50% auto auto 50%",
    padding: "0",
    borderRadius: "12px",
    border: "none",
    zIndex: 1001,
    overflow: "hidden",
    height: "100%",
    // maxHeight: "90vh",
    // width: "90vw",
    // maxWidth: "950px"
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
    zIndex: 1000,
  },
};

export const MovieModal = ({
  isOpen,
  handleClose,
  selectedMovie,
  fetchUrl,
}) => {
  if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
  }
  
  const base_url = "https://image.tmdb.org/t/p/original/";
  const [videos, setVideos] = useState([]);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [movieLogo, setMovieLogo] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [castAndCrew, setCastAndCrew] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const { innerWidth: screenWidth } = window;
  const type2 = fetchUrl?.includes("tv") ? "tv" : "movie";
  const youtubePlayerRef = useRef(null);

  // Load YouTube API
  useEffect(() => {
    if (window.YT) return;
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = function() {
      console.log('YouTube API is ready');
    };
    
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPlayTrailer(false);
      setIsMuted(true);
      setShowMoreDetails(false);
      youtubePlayerRef.current = null;
    }
  }, [isOpen]);

  // Fetch all movie data when movie changes
  useEffect(() => {
    if (!selectedMovie?.id || !isOpen) return;

    // Fetch videos
    const fetchVideos = async () => {
      try {
        const request = await axios.get(
          `https://api.themoviedb.org/3/${type2}/${selectedMovie.id}/videos?api_key=${API_KEY}`
        );
        if (request.data.results && request.data.results.length > 0) {
          setVideos(request.data.results);
          setPlayTrailer(true);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    
    // Fetch logo
    const fetchLogo = async () => {
      try {
        const type = selectedMovie?.media_type === 'tv' || selectedMovie?.first_air_date ? "tv" : "movie";
        const request = await axios.get(
          `https://api.themoviedb.org/3/${type}/${selectedMovie.id}/images?api_key=${API_KEY}`
        );
        if (request.data.logos && request.data.logos.length > 0) {
          setMovieLogo(request.data.logos[0].file_path);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    // Fetch movie/TV show details
    const fetchDetails = async () => {
      try {
        const type = selectedMovie?.media_type === 'tv' || selectedMovie?.first_air_date ? "tv" : "movie";
        
        // Get main details
        const detailsRequest = await axios.get(
          `https://api.themoviedb.org/3/${type}/${selectedMovie.id}?api_key=${API_KEY}`
        );
        
        // Get release dates (for movies) or content ratings (for TV shows)
        let ratingsRequest;
        if (type === 'movie') {
          ratingsRequest = await axios.get(
            `https://api.themoviedb.org/3/movie/${selectedMovie.id}/release_dates?api_key=${API_KEY}`
          );
          detailsRequest.data.release_dates = ratingsRequest.data;
        } else {
          ratingsRequest = await axios.get(
            `https://api.themoviedb.org/3/tv/${selectedMovie.id}/content_ratings?api_key=${API_KEY}`
          );
          detailsRequest.data.content_ratings = ratingsRequest.data;
        }
        
        setMovieDetails(detailsRequest.data);

        // Fetch credits
        const creditsRequest = await axios.get(
          `https://api.themoviedb.org/3/${type}/${selectedMovie.id}/credits?api_key=${API_KEY}`
        );
        setCastAndCrew(creditsRequest.data);

        // Fetch similar content
        const similarRequest = await axios.get(
          `https://api.themoviedb.org/3/${type}/${selectedMovie.id}/similar?api_key=${API_KEY}`
        );
        setSimilarMovies(similarRequest.data.results || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchVideos();
    fetchLogo();
    fetchDetails();
  }, [selectedMovie?.id, type2, isOpen]);

  // Initialize YouTube player
  useEffect(() => {
    if (playTrailer && videos.length > 0) {
      const checkForIframe = setInterval(() => {
        if (document.getElementById('netflix-trailer-iframe')) {
          clearInterval(checkForIframe);
          
          const connectOnLoad = () => {
            if (window.YT && window.YT.Player) {
              if (youtubePlayerRef.current) return;
              
              const iframe = document.getElementById('netflix-trailer-iframe');
              if (iframe) {
                try {
                  youtubePlayerRef.current = new window.YT.Player('netflix-trailer-iframe', {
                    events: {
                      'onReady': (event) => {
                        event.target.mute();
                        setIsMuted(true);
                      }
                    }
                  });
                } catch (err) {
                  console.error('Error connecting to YouTube player:', err);
                }
              }
            } else {
              setTimeout(connectOnLoad, 100);
            }
          };
          
          connectOnLoad();
        }
      }, 100);
      
      return () => clearInterval(checkForIframe);
    }
  }, [playTrailer, videos]);

  const toggleMute = () => {
    if (youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        youtubePlayerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const handleModalClose = () => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.stopVideo();
      } catch (e) {
        console.error('Error stopping video:', e);
      }
    }
    
    setPlayTrailer(false);
    setTimeout(() => {
      handleClose(false);
    }, 50);
  };

  const handleTrailerClick = (video) => {
    setPlayTrailer(true);
    // Find the clicked video in the videos array and set it as the first one
    const newVideos = [video, ...videos.filter(v => v.id !== video.id)];
    setVideos(newVideos);
  };

  const handleSimilarMovieClick = (movie) => {
    // Close current modal and open a new one for the similar movie
    handleModalClose();
    // You might want to trigger a callback to open a new modal with the selected movie
    console.log('Similar movie clicked:', movie);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAgeRating = () => {
    if (!movieDetails?.release_dates && !movieDetails?.content_ratings) return null;

    console.log({ movieDetails });
    
    
    // For movies
    if (movieDetails.release_dates?.results) {
      const usRating = movieDetails.release_dates.results.find(r => r.iso_3166_1 === 'GB' ?? r.iso_3166_1 === 'US');
      if (usRating?.release_dates?.[0]?.certification) {
        return usRating.release_dates[0].certification;
      }
    }
    
    // For TV shows
    if (movieDetails.content_ratings?.results) {
      const usRating = movieDetails.content_ratings.results.find(r => r.iso_3166_1 === 'GB' ?? r.iso_3166_1 === 'US');
      if (usRating?.rating) {
        return usRating.rating;
      }
    }
    
    return null;
  };

  const renderTrailer = () => {
    const trailer = videos?.find((vid) => vid.type === "Trailer") || videos[0];
    
    if (!trailer) return <div>No trailer available</div>;
    
    return (
      <PlayerWrapper>
        <div className="youtube-wrapper">
          <iframe
            id="netflix-trailer-iframe"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        
        <ModalContent>
          {movieLogo ? (
            <MovieLogo 
              src={`${base_url}${movieLogo}`} 
              alt={selectedMovie?.title || selectedMovie?.name || ""}
            />
          ) : (
            <MovieTitle>
              {selectedMovie?.title || selectedMovie?.name || ""}
            </MovieTitle>
          )}
          
          <ModalButtonsContainer>
            <ModalPlayButton onClick={() => {
              if (youtubePlayerRef.current) {
                youtubePlayerRef.current.playVideo();
              }
            }}>
              <ModalPlayIcon
                src="https://img.icons8.com/ios-glyphs/100/000000/play--v1.png"
                alt="play movie"
              />
              Play
            </ModalPlayButton>
            {/* <ModalInfoButton onClick={() => setShowMoreDetails(true)}>
              <ModalInfoIcon
                src="https://img.icons8.com/pastel-glyph/64/FFFFFF/info--v1.png"
                alt="more movie info"
              />
              More Info
            </ModalInfoButton> */}
          </ModalButtonsContainer>
        </ModalContent>
        
        <CustomMuteButton onClick={toggleMute}>
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </CustomMuteButton>
      </PlayerWrapper>
    );
  };

  const renderMainDetails = () => (
    <MovieInfoContainer>
      {/* Basic Info Row */}
      <MovieMetaRow>
        <div>
          <DescriptionHeader>
            <ReleaseDate>
              {selectedMovie?.release_date?.substring(0, 4) || 
              selectedMovie?.first_air_date?.substring(0, 4) || 
              "Year unknown"}
            </ReleaseDate>
            
            {getAgeRating() && (
              <AgeRating>{getAgeRating()}</AgeRating>
            )}
            
            {movieDetails && (movieDetails.runtime || movieDetails.episode_run_time.length > 0) && (
              <Duration>
                {movieDetails.runtime 
                  ? formatDuration(movieDetails.runtime)
                  : formatDuration(movieDetails.episode_run_time?.[0])}
              </Duration>
            )}
          </DescriptionHeader>
          
          {/* {movieDetails?.spoken_languages?.[0] && (
            <span>{movieDetails.spoken_languages[0].english_name}</span>
          )} */}

        <MovieDescription>
          {selectedMovie?.overview || "No description available"}
        </MovieDescription>

        </div>

          <div>
            {castAndCrew?.cast && (
              <MovieDetails>
                <MetaLabel>Cast:</MetaLabel>
                <MetaValue>
                  {castAndCrew.cast.slice(0, 10).map(actor => actor.name).join(", ")}
                </MetaValue>
              </MovieDetails>
            )}

            {movieDetails?.genres && (
              <MovieDetails>
                <MetaLabel>Genres:</MetaLabel>
                <MetaValue>
                  {movieDetails.genres.map(genre => genre.name).join(", ")}
                </MetaValue>
              </MovieDetails>
            )}

            <MovieDetails>
              <MetaLabel>This {type2 === 'tv' ? 'show' : 'film'} is:</MetaLabel>
              <MetaValue>{getAgeRating() || 'Not Rated'}</MetaValue>
            </MovieDetails>
          </div>

      </MovieMetaRow>

      {/* Cast */}
      {castAndCrew?.cast && (
        <MovieDetails>
          <MetaLabel>Cast:</MetaLabel>
          <CastList>
            {castAndCrew.cast.slice(0, 4).map((actor, index) => (
              <span key={actor.id}>
                {actor.name}
                {index < 3 && index < castAndCrew.cast.slice(0, 4).length - 1 && ", "}
              </span>
            ))}
            {castAndCrew.cast.length > 4 && (
              <MoreDetailsButton onClick={() => setShowMoreDetails(true)}>
                <em>more</em>
              </MoreDetailsButton>
            )}
          </CastList>
        </MovieDetails>
      )}

      {/* Genres */}
      {movieDetails?.genres && (
        <MovieDetails>
          <MetaLabel>Genres:</MetaLabel>
          <GenreList>
            {movieDetails.genres.map((genre) => genre.name).join(", ")}
          </GenreList>
        </MovieDetails>
      )}

      {/* More Like This */}
      {similarMovies.length > 0 && (
        <SimilarSection>
          <SimilarTitle>More Like This</SimilarTitle>
          <SimilarGrid>
            {similarMovies.slice(0, 6).map((movie) => (
              <SimilarCard key={movie.id} onClick={() => handleSimilarMovieClick(movie)}>
                <SimilarImage
                  src={`${base_url}${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title || movie.name}
                />
                <SimilarCardTitle>
                  {movie.title || movie.name}
                </SimilarCardTitle>
                <SimilarCardDuration>
                  {movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4)}
                </SimilarCardDuration>
              </SimilarCard>
            ))}
          </SimilarGrid>
        </SimilarSection>
      )}


      {/* Trailers & More */}
      {videos.length > 0 && (
        <TrailersSection>
          <SimilarTitle>Trailers & More</SimilarTitle>
          <TrailerGrid>
            {videos.slice(0, 4).map((video) => (
              <TrailerCard key={video.id} onClick={() => handleTrailerClick(video)}>
                <TrailerThumbnail
                  src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                  alt={video.name}
                />
                <TrailerTitle>{video.name}</TrailerTitle>
                <TrailerDuration>{video.type}</TrailerDuration>
              </TrailerCard>
            ))}
          </TrailerGrid>
        </TrailersSection>
      )}
    </MovieInfoContainer>
  );

  // const renderExpandedDetails = () => (
  //   <ExpandedContent>
  //     {/* About Section */}
  //     <div>
  //       {/* <MovieMeta>
  //         <h3>About {selectedMovie?.title || selectedMovie?.name}</h3>
  //       </MovieMeta> */}
        
  //       {/* Creator/Director */}
  //       {/* {castAndCrew?.crew && (
  //         <MovieDetails>
  //           <MetaLabel>
  //             {type2 === 'tv' ? 'Creator:' : 'Director:'}
  //           </MetaLabel>
  //           <MetaValue>
  //             {type2 === 'tv' 
  //               ? (castAndCrew.created_by?.[0]?.name || 
  //                  castAndCrew.crew.find(person => person.job === 'Creator')?.name || 
  //                  castAndCrew.crew.find(person => person.job === 'Executive Producer')?.name || 
  //                  'Unknown')
  //               : (castAndCrew.crew.find(person => person.job === 'Director')?.name || 'Unknown')
  //             }
  //           </MetaValue>
  //         </MovieDetails>
  //       )} */}

  //       {/* Full Cast */}
  //       {castAndCrew?.cast && (
  //         <MovieDetails>
  //           <MetaLabel>Cast:</MetaLabel>
  //           <MetaValue>
  //             {castAndCrew.cast.slice(0, 10).map(actor => actor.name).join(", ")}
  //           </MetaValue>
  //         </MovieDetails>
  //       )}

  //       {/* Writers */}
  //       {/* {castAndCrew?.crew && (
  //         <MovieDetails>
  //           <MetaLabel>Writer:</MetaLabel>
  //           <MetaValue>
  //             {castAndCrew.crew
  //               .filter(person => person.department === 'Writing')
  //               .slice(0, 3)
  //               .map(writer => writer.name)
  //               .join(", ") || 'Unknown'
  //             }
  //           </MetaValue>
  //         </MovieDetails>
  //       )} */}

  //       {/* Genres */}
  //       {movieDetails?.genres && (
  //         <MovieDetails>
  //           <MetaLabel>Genres:</MetaLabel>
  //           <MetaValue>
  //             {movieDetails.genres.map(genre => genre.name).join(", ")}
  //           </MetaValue>
  //         </MovieDetails>
  //       )}

  //       {/* Age Rating */}
  //       <MovieDetails>
  //         <MetaLabel>This {type2 === 'tv' ? 'show' : 'film'} is:</MetaLabel>
  //         <MetaValue>{getAgeRating() || 'Not Rated'}</MetaValue>
  //       </MovieDetails>
  //     </div>

  //     {/* <DetailsSeparator /> */}

  //     {/* <DetailsSeparator /> */}

  //   </ExpandedContent>
  // );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      style={customStyles}
      ariaHideApp={false}
      closeTimeoutMS={300}
      contentLabel="Movie Details Modal"
    >
      <ModalContainer showExpanded={showMoreDetails}>
        <HeaderContainer>
          <CloseButtonContainer>
            <CloseButton onClick={handleModalClose} />
          </CloseButtonContainer>

          {!!playTrailer && videos?.length > 0 ? (
            renderTrailer()
          ) : (
            <>
              <MovieCoverImage
                src={`${base_url}${selectedMovie?.backdrop_path || ""}`}
                alt={selectedMovie?.title || selectedMovie?.name || ""}
              />
              <MovieTitle>
                {selectedMovie?.title || selectedMovie?.name || ""}
              </MovieTitle>
              <PlayButton
                onClick={(e) => {
                  setPlayTrailer(true);
                  e.preventDefault();
                }}
              >
                <PlayIcon alt="play" />
                Play
              </PlayButton>
            </>
          )}
        </HeaderContainer>

        <MovieInfo>
          {renderMainDetails()}
          {/* {renderExpandedDetails()} */}
        </MovieInfo>
        {/* {showMoreDetails ? renderExpandedDetails() : renderMainDetails()} */}
      </ModalContainer>
    </Modal>
  );
};
