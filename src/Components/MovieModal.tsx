import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import YouTube from "react-youtube";
import "react-loading-skeleton/dist/skeleton.css";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { useMovieModal } from "../hooks/useMovieModal";
import { useModalScrollLock } from "../hooks/useModalScrollLock";
import { getAgeRating } from "../utils/movieUtils";
import { MovieActionButtons } from "./MovieActionButtons";
import { MovieCover } from "./MovieCover";
import { ModalHeaderSkeleton, ModalContentSkeleton } from "./ModalSkeletons";
import {
  CloseButton,
  CloseButtonContainer,
  HeaderContainer,
  ModalContainer,
  MovieDescription,
  MovieInfoContainer,
  PlayButton,
  PlayIcon,
  ReleaseDate,
  CustomMuteButton,
  MuteIcon,
  UnmuteIcon,
  PlayerWrapper,
  ModalContent,
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
  DescriptionHeader,
  MovieLogo,
} from "../styles/MovieModal.styles";

interface Video {
  id?: string;
  key: string;
  name: string;
  type: string;
  site?: string;
  official?: boolean;
}

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

export const MovieModal = ({
  isOpen,
  handleClose,
  selectedMovie,
  fetchUrl,
  onMovieChange,
}: {
  isOpen: boolean;
  handleClose: (isOpen: boolean) => void;
  selectedMovie: {
    id: number | string;
    media_type?: string;
    first_air_date?: string;
    release_date?: string;
    backdrop_path?: string;
    title?: string;
    name?: string;
    overview?: string;
  };
  fetchUrl: string;
  onMovieChange?: (movie: {
    id?: number | string;
    media_type?: string;
    title?: string;
    name?: string;
    overview?: string;
  }) => void;
}) => {
  if (typeof window !== "undefined") {
    Modal.setAppElement("#root");
  }

  const base_url = "https://image.tmdb.org/t/p/original/";
  const [playTrailer, setPlayTrailer] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const type2 = fetchUrl?.includes("tv") ? "tv" : "movie";

  const { videos, movieDetails, castAndCrew, similarMovies, isLoading, getEnglishLogo } = useMovieModal({
    movieId: selectedMovie?.id,
    movieType: type2,
    isEnabled: isOpen && !!selectedMovie?.id,
  });

  useModalScrollLock(isOpen);

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
    resetPlayer,
  } = useYouTubePlayer();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPlayTrailer(false);
        setSelectedVideo(null);
        setShowMoreDetails(false);
        resetPlayer();
        youtubePlayerRef.current = null;
      }, 0);
    }
  }, [isOpen, resetPlayer, youtubePlayerRef]);

  useEffect(() => {
    setTimeout(() => {
      if (videos && videos.length > 0 && isOpen) {
        setPlayTrailer(true);
      } else {
        setPlayTrailer(false);
      }
    }, 0);
  }, [videos, isOpen]);

  const handleModalClose = () => {
    if (youtubePlayerRef.current?.internalPlayer) {
      try {
        youtubePlayerRef.current.internalPlayer.pauseVideo();
      } catch (e) {
        console.error("Error pausing video:", e);
      }
    }

    setPlayTrailer(false);
    setTimeout(() => {
      handleClose(false);
    }, 50);
  };

  const handleTrailerClick = (video: Video) => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    setSelectedVideo(video);
    setPlayTrailer(true);
  };

  const handleSimilarMovieClick = (movie: {
    id: number | string;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date?: string;
    first_air_date?: string;
  }): void => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    setPlayTrailer(false);
    setSelectedVideo(null);

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

  const handlePlayPauseAction = () => {
    const action = handlePlayPause();
    if (action === "restart") {
      setPlayTrailer(true);
    }
  };

  const renderTrailer = () => {
    const trailer = selectedVideo || videos?.find((vid) => vid.type === "Trailer") || videos[0];

    if (!trailer) return <div>No trailer available</div>;

    return (
      <PlayerWrapper>
        { !videoEnded && (
          <div className="youtube-wrapper">
            <YouTube
              videoId={ trailer.key }
              opts={ getYouTubeOptions() }
              onReady={ handleVideoReady }
              onEnd={ handleVideoEnd }
              onStateChange={ handleVideoStateChange }
              ref={ youtubePlayerRef }
            />
          </div>
        ) }
        { videoEnded && <MovieCover movie={ selectedMovie } baseUrl={ base_url } /> }
        <ModalContent>
          <MovieLogo src={ `${base_url}${getEnglishLogo()?.file_path}` } alt={ selectedMovie?.title || selectedMovie?.name } />
          <MovieActionButtons
            movie={ selectedMovie }
            onPlayPause={ handlePlayPauseAction }
            isPlaying={ isPlaying }
            videoEnded={ videoEnded }
          />
        </ModalContent>
        { !videoEnded && (
          <CustomMuteButton onClick={ toggleMute }>{ isMuted ? <MuteIcon /> : <UnmuteIcon /> }</CustomMuteButton>
        ) }
      </PlayerWrapper>
    );
  };

  return (
    <Modal
      isOpen={ isOpen }
      onRequestClose={ handleModalClose }
      style={ customStyles }
      ariaHideApp={ false }
      closeTimeoutMS={ 0 }
      contentLabel="Movie Details Modal"
    >
      <ModalContainer ref={ modalContentRef } showExpanded={ showMoreDetails }>
        <HeaderContainer>
          <CloseButtonContainer>
            <CloseButton onClick={ handleModalClose } />
          </CloseButtonContainer>
          { isLoading ? (
            <ModalHeaderSkeleton />
          ) : (
            !!playTrailer && videos?.length > 0 ? (
              renderTrailer()
            ) : (
              <>
                <MovieCover movie={ selectedMovie } baseUrl={ base_url } />
                <MovieLogo src={ `${base_url}${getEnglishLogo()?.file_path}` } alt={ selectedMovie?.title || selectedMovie?.name } />
                <PlayButton
                  onClick={ (e) => {
                    setPlayTrailer(true);
                    e.preventDefault();
                  } }
                >
                  <PlayIcon />
                  Play
                </PlayButton>
              </>
            )
          ) }
        </HeaderContainer>
        { isLoading ? (
          <ModalContentSkeleton />
        ) : (
          <MovieInfo>
            <MovieInfoContainer>
              <MovieMetaRow>
                <div>
                  <DescriptionHeader>
                    <ReleaseDate>
                      { selectedMovie?.release_date?.substring(0, 4) ||
                        selectedMovie?.first_air_date?.substring(0, 4) ||
                        "Year unknown" }
                    </ReleaseDate>

                    { getAgeRating(movieDetails) && <AgeRating>{ getAgeRating(movieDetails) }</AgeRating> }

                    { movieDetails &&
                      (movieDetails.runtime ||
                        (movieDetails.episode_run_time && movieDetails.episode_run_time.length > 0)) && (
                        <Duration>
                          { movieDetails.runtime
                            ? formatDuration(movieDetails.runtime)
                            : formatDuration(movieDetails.episode_run_time?.[0] || 0) }
                        </Duration>
                      ) }
                  </DescriptionHeader>
                  <MovieDescription>{ selectedMovie?.overview || "No description available" }</MovieDescription>
                </div>
                <div>
                    { castAndCrew?.cast && (
                    <MovieDetails>
                      <MetaLabel>Cast:</MetaLabel>
                      <MetaValue>
                        { castAndCrew.cast
                          .slice(0, 10)
                          .map((actor) => actor.name)
                          .join(", ") }
                      </MetaValue>
                    </MovieDetails>
                  ) }
                  { movieDetails?.genres && (
                    <MovieDetails>
                      <MetaLabel>Genres:</MetaLabel>
                      <MetaValue>{ movieDetails.genres.map((genre) => genre.name).join(", ") }</MetaValue>
                    </MovieDetails>
                  ) }
                  <MovieDetails>
                    <MetaLabel>This { type2 === "tv" ? "show" : "film" } is:</MetaLabel>
                    <MetaValue>{ getAgeRating(movieDetails) || "Not Rated" }</MetaValue>
                  </MovieDetails>
                </div>
              </MovieMetaRow>
              { similarMovies.length > 0 && (
                <SimilarSection>
                  <SimilarTitle>More Like This</SimilarTitle>
                  <SimilarGrid>
                    { similarMovies.slice(0, 6).map((movie) => (
                      <SimilarCard key={ movie.id } onClick={ () => handleSimilarMovieClick(movie) }>
                        <SimilarImage
                          src={ `${base_url}${movie.backdrop_path || movie.poster_path}` }
                          alt={ movie.title || movie.name }
                        />
                        <SimilarCardTitle>{ movie.title || movie.name }</SimilarCardTitle>
                        <SimilarCardDuration>
                          { movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) }
                        </SimilarCardDuration>
                      </SimilarCard>
                    )) }
                  </SimilarGrid>
                </SimilarSection>
              ) }
              { videos.length > 0 && (
                <TrailersSection>
                  <SimilarTitle>Trailers & More</SimilarTitle>
                  <TrailerGrid>
                    { videos.slice(0, 4).map((video) => (
                      <TrailerCard key={ video.id } onClick={ () => handleTrailerClick(video) }>
                        <TrailerThumbnail
                          src={ `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg` }
                          alt={ video.name }
                        />
                        <TrailerTitle>{ video.name }</TrailerTitle>
                        <TrailerDuration>{ video.type }</TrailerDuration>
                      </TrailerCard>
                    )) }
                  </TrailerGrid>
                </TrailersSection>
              ) }
            </MovieInfoContainer>
          </MovieInfo>
        ) }
      </ModalContainer>
    </Modal>
  );
};
