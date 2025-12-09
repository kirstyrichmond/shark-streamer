import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAnyModalOpen, openModal, closeModal } from "../store/slices/userSlice";
import { MovieModal } from "./MovieModal";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { getEnglishLogo, getMovieType } from "../utils/movieUtils";
import {
  BannerContainer,
  BannerContent,
  BannerDescription,
  BannerTitle,
  ButtonsContainer,
  InfoButton,
  InfoIcon,
  PlayButton,
  PlayIcon,
  PauseIcon,
  BannerPlayerWrapper,
  CustomMuteButton,
  MuteIcon,
  UnmuteIcon,
  MovieIcon,
} from "../styles/Banner.styles";
import { Movie } from "../utils/movieUtils";
import { AppDispatch } from "../app/store";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../queries/movieQueries";

interface TruncateFunction {
  (string: string): string;
}

export const Banner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [playTrailer, setPlayTrailer] = useState<boolean>(false);
  const [openMovieModal, setOpenMovieModal] = useState<boolean>(false);
  const [trailerWasPlaying, setTrailerWasPlaying] = useState<boolean>(false);
  const isAnyModalOpen = useSelector(selectIsAnyModalOpen);

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

  const { data: bannerMovie } = useQuery(movieQueries.trendingBanner());
  
  const [displayedMovie, setDisplayedMovie] = useState<Movie | null>(null);
  const [modalSelectedMovie, setModalSelectedMovie] = useState<Movie | null>(null);
  
  const movie = displayedMovie || bannerMovie;
  
  const movieType = movie ? getMovieType(movie) : "movie";
  const movieId = movie?.id ? String(movie.id) : "";
  
  const { data: videos = [] } = useQuery(movieQueries.videos(movieType, movieId));
  const { data: images, isLoading: imagesLoading } = useQuery(movieQueries.images(movieType, movieId));
  
  const logo = images ? getEnglishLogo(images.logos) : null;

  useEffect(() => {
    if (bannerMovie && !displayedMovie) {
      setDisplayedMovie(bannerMovie);
    }
  }, [bannerMovie, displayedMovie]);

  useEffect(() => {
    if (openMovieModal && bannerMovie && !modalSelectedMovie) {
      setModalSelectedMovie(bannerMovie);
    }
  }, [openMovieModal, bannerMovie, modalSelectedMovie]);

  useEffect(() => {
    if (videos && videos.length > 0 && !playTrailer) {
      setPlayTrailer(true);
    }
  }, [videos, playTrailer]);

  useEffect(() => {
    if (isAnyModalOpen) {
      if (playTrailer && !videoEnded && isPlaying) {
        const player = youtubePlayerRef.current?.internalPlayer;
        if (player) {
          try {
            player.pauseVideo();
            setTimeout(() => setTrailerWasPlaying(true), 0);
          } catch (e) {
            console.error("Failed to pause banner video:", e);
          }
        }
      }
    } else {
      if (trailerWasPlaying) {
        const player = youtubePlayerRef.current?.internalPlayer;
        if (player) {
          try {
            player.playVideo();
            setTimeout(() => setTrailerWasPlaying(false), 0);
          } catch (e) {
            console.error("Failed to resume banner video:", e);
          }
        }
      }
    }
  }, [isAnyModalOpen, playTrailer, videoEnded, isPlaying, youtubePlayerRef, trailerWasPlaying]);

  const truncate: TruncateFunction = (string) => {
    if (!string) return "";
    
    const sentences = string.split(". ");
    const firstSentence = sentences[0];
    
    return firstSentence + (firstSentence.endsWith(".") ? "" : ".");
  };

  const renderBannerContent = (showPlayButton = true, onPlayClick: (() => void) | null | undefined = undefined) => (
    <BannerContent>
      { logo ? (
        <MovieIcon
          src={ `https://image.tmdb.org/t/p/original/${logo}` }
          alt={ movie?.title || movie?.name || movie?.original_name }
        />
      ) : !imagesLoading ? (
        <BannerTitle>{ movie?.title || movie?.name || movie?.original_name }</BannerTitle>
      ) : null }
      <BannerDescription>{ truncate(movie?.overview) }</BannerDescription>
      <ButtonsContainer>
        { showPlayButton && (
          <PlayButton onClick={ onPlayClick || (() => handlePlayPauseAction(() => setPlayTrailer(true))) }>
            { videoEnded || !isPlaying ? <PlayIcon /> : <PauseIcon /> }
            { videoEnded || !isPlaying ? "Play" : "Pause" }
          </PlayButton>
        ) }
        <InfoButton
          onClick={ () => {
            setOpenMovieModal(true);
            dispatch(openModal());
          } }
        >
          <InfoIcon src="https://img.icons8.com/pastel-glyph/64/FFFFFF/info--v1.png" alt="more movie info" />
          More Info
        </InfoButton>
      </ButtonsContainer>
    </BannerContent>
  );

  const renderTrailer = () => {
    const trailer = videos?.find((vid: { key: string; type: string }) => vid.type === "Trailer") || videos[0];

    if (!trailer || !trailer.key) return null;

    if (videoEnded) {
      return (
        <BannerContainer
          style={ {
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          } }
        >
          { renderBannerContent() }
        </BannerContainer>
      );
    }

    return (
      <BannerPlayerWrapper>
        <div className="youtube-wrapper">
          <YouTube
            videoId={ trailer.key }
            opts={ getYouTubeOptions() }
            onReady={ handleVideoReady }
            onEnd={ handleVideoEnd }
            onStateChange={ handleVideoStateChange }
            onError={ (error) => {
              console.error("YouTube player error:", error);
              setPlayTrailer(false);
            } }
            ref={ youtubePlayerRef }
          />
        </div>
        { renderBannerContent() }
        <CustomMuteButton onClick={ toggleMute } aria-label={ isMuted ? "Unmute" : "Mute" }>
          { isMuted ? <MuteIcon /> : <UnmuteIcon /> }
        </CustomMuteButton>
      </BannerPlayerWrapper>
    );
  };

  return (
    <>
      { movie && (
        <MovieModal
          selectedMovie={ modalSelectedMovie || movie }
          isOpen={ openMovieModal }
          fetchUrl={ getMovieType(modalSelectedMovie || movie) }
          handleClose={ (value: boolean) => {
            setOpenMovieModal(value);
            if (!value) {
              dispatch(closeModal());
              setModalSelectedMovie(null);
            }
          } }
          onMovieChange={ (newMovie: Movie) => {
            setModalSelectedMovie(newMovie);
          } }
        />
      ) }
      { playTrailer && videos?.length > 0 ? (
        renderTrailer()
      ) : (
        <BannerContainer
          style={ {
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          } }
        >
          { renderBannerContent(true, () => {
            setPlayTrailer(true);
            resetPlayer();
          }) }
        </BannerContainer>
      ) }
    </>
  );
};
