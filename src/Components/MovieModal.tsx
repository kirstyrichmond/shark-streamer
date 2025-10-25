import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import YouTube from "react-youtube";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { WatchlistButton } from "./WatchlistButton";
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
  PauseIcon,
  ReleaseDate,
  CustomMuteButton,
  MuteIcon,
  UnmuteIcon,
  PlayerWrapper,
  ModalContent,
  MovieLogo,
  ModalButtonsContainer,
  ModalPlayButton,
  MovieDetails,
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
  MovieInfo,
  DescriptionHeader
} from "../styles/MovieModal.styles";
import { movieAPI } from "../services/api";

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
};

const customStyles = {
  content: {
    top: "2em",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -49%)",
    inset: "50% auto auto 50%",
    padding: "0",
    borderRadius: "12px",
    border: "none",
    zIndex: 1001,
    overflow: "hidden",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
    zIndex: 1000,
  },
};

interface MovieDetailsAPI {
  release_dates?: {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{
        certification: string;
      }>;
    }>;
  };
  content_ratings?: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
  runtime?: number;
  episode_run_time?: number[];
  genres?: Array<{ name: string }>;
}

export const MovieModal = ({
  isOpen,
  handleClose,
  selectedMovie,
  fetchUrl,
  onMovieChange,
}: {
  isOpen: boolean;
  handleClose: (isOpen: boolean) => void;
  selectedMovie: { id?: number | string; media_type?: string; first_air_date?: string; release_date?: string; backdrop_path?: string; title?: string; name?: string; overview?: string };
  fetchUrl: string;
  onMovieChange?: (movie: any) => void;
}) => {
  if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
  }
  
  const base_url = "https://image.tmdb.org/t/p/original/";
  const [videos, setVideos] = useState<Video[]>([]);
  const [playTrailer, setPlayTrailer] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [movieLogo, setMovieLogo] = useState(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetailsAPI | null>(null);
  interface CastAndCrew {
    cast: Array<{ name: string }>;
    crew: Array<{ name: string }>;
  }

  interface SimilarMovie {
    id: number | string;
    backdrop_path?: string;
    poster_path?: string;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
  }
  
  const [castAndCrew, setCastAndCrew] = useState<CastAndCrew | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const type2 = fetchUrl?.includes("tv") ? "tv" : "movie";
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  
  const {
    isPlaying,
    videoEnded,
    isMuted,
    youtubePlayerRef,
    handleVideoEnd,
    handleVideoStateChange,
    handleVideoReady,
    handlePlayPause,
    toggleMute,
    getYouTubeOptions,
    resetPlayer
  } = useYouTubePlayer();


  useEffect(() => {
    if (!isOpen) {
      setPlayTrailer(false);
      setSelectedVideo(null);
      setShowMoreDetails(false);
      resetPlayer();
      youtubePlayerRef.current = null;
    }
  }, [isOpen, resetPlayer, youtubePlayerRef]);

  useEffect(() => {
    if (!selectedMovie?.id || !isOpen) return;
    setSelectedVideo(null);

    const fetchVideos = async () => {
      try {
        const request = await movieAPI.fetchVideos(type2, String(selectedMovie.id));
        if (request.data.results && request.data.results.length > 0) {
          setVideos(request.data.results);
          setPlayTrailer(true);
        } else {
          // No videos found, make sure trailer is not playing
          setVideos([]);
          setPlayTrailer(false);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
        setPlayTrailer(false);
      }
    };
    
    const fetchLogo = async () => {
      try {
        const type = selectedMovie?.media_type === 'tv' || selectedMovie?.first_air_date ? "tv" : "movie";
        const request = await movieAPI.fetchImages(type, String(selectedMovie.id));
        if (request.data.logos && request.data.logos.length > 0) {
            const englishLogo = request.data.logos.find((logo: { iso_639_1: string | null }) => 
            logo.iso_639_1 === 'en' || logo.iso_639_1 === null
            );
          
          const selectedLogo = englishLogo || request.data.logos[0];
          setMovieLogo(selectedLogo.file_path);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    const fetchDetails = async () => {
      try {
        const type = selectedMovie?.media_type === 'tv' || selectedMovie?.first_air_date ? "tv" : "movie";
        
        const detailsRequest = await movieAPI.fetchMovieDetails(type, String(selectedMovie.id));
        
        let ratingsRequest;
        if (type === 'movie') {
          ratingsRequest = await movieAPI.fetchReleaseDates(String(selectedMovie.id));
          detailsRequest.data.release_dates = ratingsRequest.data;
        } else {
          ratingsRequest = await movieAPI.fetchContentRatings(String(selectedMovie.id));
          detailsRequest.data.content_ratings = ratingsRequest.data;
        }
        
        setMovieDetails(detailsRequest.data);

        const creditsRequest = await movieAPI.fetchCredits(type, String(selectedMovie.id));
        setCastAndCrew(creditsRequest.data);

        const similarRequest = await movieAPI.fetchSimilar(type, String(selectedMovie.id));
        setSimilarMovies(similarRequest.data.results || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchVideos();
    fetchLogo();
    fetchDetails();
  }, [selectedMovie?.id, selectedMovie?.media_type, selectedMovie?.first_air_date, type2, isOpen]);



  const handleModalClose = () => {
    if (youtubePlayerRef.current?.internalPlayer) {
      try {
        youtubePlayerRef.current.internalPlayer.pauseVideo();
      } catch (e) {
        console.error('Error pausing video:', e);
      }
    }
    
    setPlayTrailer(false);
    setTimeout(() => {
      handleClose(false);
    }, 50);
  };

  const handleTrailerClick = (video: Video) => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setSelectedVideo(video);
    setPlayTrailer(true);
  };

  const handleSimilarMovieClick = (movie: SimilarMovie): void => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Reset trailer state when changing movies
    setPlayTrailer(false);
    setSelectedVideo(null);
    setVideos([]);
    
    if (onMovieChange) {
      onMovieChange(movie);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours: number = Math.floor(minutes / 60);
    const mins: number = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAgeRating = () => {
    if (!movieDetails?.release_dates && !movieDetails?.content_ratings) return null;    
    
    if (movieDetails.release_dates?.results) {
      const usRating = movieDetails.release_dates.results.find(r => r.iso_3166_1 === 'GB' || r.iso_3166_1 === 'US');
      if (usRating?.release_dates?.[0]?.certification) {
        return usRating.release_dates[0].certification;
      }
    }
    
    if (movieDetails.content_ratings?.results) {
      const usRating = movieDetails.content_ratings.results.find(r => r.iso_3166_1 === 'GB' || r.iso_3166_1 === 'US');
      if (usRating?.rating) {
        return usRating.rating;
      }
    }
    
    return null;
  };

  const renderTrailer = () => {
    const trailer = selectedVideo || videos?.find((vid) => vid.type === "Trailer") || videos[0];
    
    if (!trailer) return <div>No trailer available</div>;
    
    if (videoEnded) {
      return (
        <PlayerWrapper>
          <MovieCoverImage
            src={`${base_url}${selectedMovie?.backdrop_path || ""}`}
            alt={selectedMovie?.title || selectedMovie?.name || ""}
          />
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
                const action = handlePlayPause();
                if (action === 'restart') {
                  setPlayTrailer(true);
                }
              }}>
                {videoEnded || !isPlaying ? <PlayIcon /> : <PauseIcon />}
                {videoEnded || !isPlaying ? "Play" : "Pause"}
              </ModalPlayButton>
              <WatchlistButton 
                movie={selectedMovie} 
              />
            </ModalButtonsContainer>
          </ModalContent>
        </PlayerWrapper>
      );
    }
    
    return (
      <PlayerWrapper>
        <div className="youtube-wrapper">
          <YouTube
            videoId={trailer.key}
            opts={getYouTubeOptions()}
            onReady={handleVideoReady}
            onEnd={handleVideoEnd}
            onStateChange={handleVideoStateChange}
            ref={youtubePlayerRef}
          />
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
              const action = handlePlayPause();
              if (action === 'restart') {
                setPlayTrailer(true);
              }
            }}>
              {videoEnded || !isPlaying ? <PlayIcon /> : <PauseIcon />}
              {videoEnded || !isPlaying ? "Play" : "Pause"}
            </ModalPlayButton>
            <WatchlistButton 
              movie={selectedMovie} 
            />
          </ModalButtonsContainer>
        </ModalContent>
        <CustomMuteButton onClick={toggleMute}>
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </CustomMuteButton>
      </PlayerWrapper>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      style={customStyles}
      ariaHideApp={false}
      closeTimeoutMS={300}
      contentLabel="Movie Details Modal"
    >
      <ModalContainer ref={modalContentRef} showExpanded={showMoreDetails}>
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
                <PlayIcon />
                Play
              </PlayButton>
            </>
          )}
        </HeaderContainer>
        <MovieInfo>
          <MovieInfoContainer>
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
                  
                  {movieDetails && (movieDetails.runtime || (movieDetails.episode_run_time && movieDetails.episode_run_time.length > 0)) && (
                    <Duration>
                      {movieDetails.runtime 
                        ? formatDuration(movieDetails.runtime)
                        : formatDuration(movieDetails.episode_run_time?.[0] || 0)}
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
        </MovieInfo>
      </ModalContainer>
    </Modal>
  );
};
