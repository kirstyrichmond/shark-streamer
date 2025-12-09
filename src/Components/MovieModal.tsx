import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import YouTube from "react-youtube";
import "react-loading-skeleton/dist/skeleton.css";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../queries/movieQueries";
import { movieAPI } from "../services/api";
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

  const movieIdString = selectedMovie?.id ? String(selectedMovie.id) : "";

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    ...movieQueries.videos(type2, movieIdString),
    enabled: isOpen && !!selectedMovie?.id,
  });

  const { data: images, isLoading: imagesLoading } = useQuery({
    ...movieQueries.images(type2, movieIdString),
    enabled: isOpen && !!selectedMovie?.id,
  });

  const { data: movieDetails, isLoading: detailsLoading } = useQuery({
    ...movieQueries.details(type2, movieIdString),
    enabled: isOpen && !!selectedMovie?.id,
  });

  const { data: castAndCrew, isLoading: creditsLoading } = useQuery({
    ...movieQueries.credits(type2, movieIdString),
    enabled: isOpen && !!selectedMovie?.id,
  });

  const { data: rawSimilarMovies = [], isLoading: similarLoading } = useQuery({
    ...movieQueries.similar(type2, movieIdString),
    enabled: isOpen && !!selectedMovie?.id,
  });

  const { data: releaseDates } = useQuery({
    ...movieQueries.releaseDates(movieIdString),
    enabled: isOpen && !!selectedMovie?.id && type2 === "movie",
  });

  const { data: contentRatings } = useQuery({
    ...movieQueries.contentRatings(movieIdString),
    enabled: isOpen && !!selectedMovie?.id && type2 === "tv",
  });

  const { data: filteredSimilarMovies = [] } = useQuery({
    queryKey: ["movies", "similar", "filtered", movieIdString, type2],
    queryFn: async () => {
      if (!rawSimilarMovies.length) return [];
      
      const movieChecks = rawSimilarMovies.slice(0, 12).map(async (movie: { id: number | string; title?: string; name?: string; backdrop_path?: string; poster_path?: string; release_date?: string; first_air_date?: string }) => {
        try {
          const response = await movieAPI.fetchVideos(type2, String(movie.id));
          const hasVideos = response.data.results && response.data.results.length > 0;
          return hasVideos ? movie : null;
        } catch {
          return null;
        }
      });
      
      const results = await Promise.allSettled(movieChecks);
      return results
        .filter((result) => result.status === "fulfilled" && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<{ id: number | string; title?: string; name?: string; backdrop_path?: string; poster_path?: string; release_date?: string; first_air_date?: string } | null>).value)
        .slice(0, 6);
    },
    enabled: isOpen && !!selectedMovie?.id && rawSimilarMovies.length > 0,
    staleTime: 1000 * 60 * 15,
  });

  const similarMovies = filteredSimilarMovies;

  const movieDetailsWithRatings = movieDetails ? {
    ...movieDetails,
    ...(type2 === "movie" && releaseDates ? { release_dates: releaseDates } : {}),
    ...(type2 === "tv" && contentRatings ? { content_ratings: contentRatings } : {}),
  } : null;

  const logos = images?.logos || [];
  const isLoading = videosLoading || imagesLoading || detailsLoading || creditsLoading || similarLoading;

  const getEnglishLogo = () => {
    return logos.find((logo: { iso_639_1: string }) => logo.iso_639_1 === "en") || logos[0];
  };

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
    handlePlayPauseAction,
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
  }, [isOpen, resetPlayer]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const renderTrailer = () => {
    const trailer = selectedVideo || videos?.find((vid: Video) => vid.type === "Trailer") || videos[0];

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
          <MovieLogo
            src={ `${base_url}${getEnglishLogo()?.file_path}` }
            alt={ selectedMovie?.title || selectedMovie?.name }
          />
          <MovieActionButtons
            movie={ selectedMovie }
            onPlayPause={ () => handlePlayPauseAction(() => setPlayTrailer(true)) }
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
          ) : !!playTrailer && videos?.length > 0 ? (
            renderTrailer()
          ) : (
            <>
              <MovieCover movie={ selectedMovie } baseUrl={ base_url } />
              <MovieLogo
                src={ `${base_url}${getEnglishLogo()?.file_path}` }
                alt={ selectedMovie?.title || selectedMovie?.name }
              />
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

                    { getAgeRating(movieDetailsWithRatings) && <AgeRating>{ getAgeRating(movieDetailsWithRatings) }</AgeRating> }

                    { movieDetailsWithRatings &&
                      (movieDetailsWithRatings.runtime ||
                        (movieDetailsWithRatings.episode_run_time && movieDetailsWithRatings.episode_run_time.length > 0)) && (
                        <Duration>
                          { movieDetailsWithRatings.runtime
                            ? formatDuration(movieDetailsWithRatings.runtime)
                            : formatDuration(movieDetailsWithRatings.episode_run_time?.[0] || 0) }
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
                          .map((actor: { name: string }) => actor.name)
                          .join(", ") }
                      </MetaValue>
                    </MovieDetails>
                  ) }
                  { movieDetailsWithRatings?.genres && (
                    <MovieDetails>
                      <MetaLabel>Genres:</MetaLabel>
                      <MetaValue>{ movieDetailsWithRatings.genres.map((genre: { id: number; name: string }) => genre.name).join(", ") }</MetaValue>
                    </MovieDetails>
                  ) }
                  <MovieDetails>
                    <MetaLabel>This { type2 === "tv" ? "show" : "film" } is:</MetaLabel>
                    <MetaValue>{ getAgeRating(movieDetailsWithRatings) || "Not Rated" }</MetaValue>
                  </MovieDetails>
                </div>
              </MovieMetaRow>
              { similarMovies.length > 0 && (
                <SimilarSection>
                  <SimilarTitle>More Like This</SimilarTitle>
                  <SimilarGrid>
                    { similarMovies.slice(0, 6).map((movie: { id: number | string; title?: string; name?: string; backdrop_path?: string; poster_path?: string; release_date?: string; first_air_date?: string }) => (
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
                    { videos.slice(0, 4).map((video: Video) => (
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
