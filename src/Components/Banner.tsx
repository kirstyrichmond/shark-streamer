import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { movieAPI } from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAnyModalOpen, openModal, closeModal } from "../store/slices/userSlice";
import { MovieModal } from "./MovieModal";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { getMovieType } from "../utils/movieUtils";
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

export const Banner = () => {
  const { innerWidth: screenWidth } = window;
  const dispatch = useDispatch<AppDispatch>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ key: string; type: string }[]>([]);
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
    handlePlayPause,
    toggleMute,
    getYouTubeOptions,
    resetPlayer,
  } = useYouTubePlayer();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await movieAPI.fetchTrending();
        const randomIndex = Math.floor(Math.random() * request.data.results.length);
        setMovie(request.data.results[randomIndex]);
        return request;
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      if (!movie?.id) return;

      try {
        const type = movie?.media_type === "tv" ? "tv" : "movie";
        const request = await movieAPI.fetchVideos(type, String(movie?.id));

        if (request.data.results && request.data.results.length > 0) {
          setVideos(request.data.results);
          setPlayTrailer(true);
        }
        return request;
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    async function fetchLogo() {
      if (!movie?.id) return;

      try {
        const type = movie?.media_type === "tv" ? "tv" : "movie";
        const request = await movieAPI.fetchImages(type, String(movie?.id));

        if (request.data.logos && request.data.logos.length > 0) {
          const englishLogo = request.data.logos.find(
            (logo: { iso_639_1: string | null }) => logo.iso_639_1 === "en" || logo.iso_639_1 === null
          );

          const selectedLogo = englishLogo || request.data.logos[0];
          setLogo(selectedLogo.file_path);
        }
        return request;
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }

    if (movie?.id) {
      fetchVideos();
      fetchLogo();
    }
  }, [movie]);

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

  const truncateAmount = screenWidth < 1280 ? 82 : 158;

  interface TruncateFunction {
    (string: string | undefined, n: number): string;
  }

  const truncate: TruncateFunction = (string, n) => {
    if (!string) return "";
    return string.length > n ? string.substring(0, n - 1) + " ..." : string;
  };

  const handlePlayPauseAction = () => {
    const action = handlePlayPause();
    if (action === "restart") {
      setPlayTrailer(true);
    }
  };

  const renderBannerContent = (showPlayButton = true, onPlayClick: (() => void) | null | undefined = undefined) => (
    <BannerContent>
      { logo ? (
        <MovieIcon
          src={ `https://image.tmdb.org/t/p/original/${logo}` }
          alt={ movie?.title || movie?.name || movie?.original_name }
        />
      ) : (
        <BannerTitle>{ movie?.title || movie?.name || movie?.original_name }</BannerTitle>
      ) }
      <BannerDescription>{ truncate(movie?.overview, truncateAmount) }</BannerDescription>
      <ButtonsContainer>
        { showPlayButton && (
          <PlayButton onClick={ onPlayClick || handlePlayPauseAction }>
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
          selectedMovie={ movie }
          isOpen={ openMovieModal }
          fetchUrl={ getMovieType(movie) }
          handleClose={ (value: boolean) => {
            setOpenMovieModal(value);
            if (!value) {
              dispatch(closeModal());
            }
          } }
          onMovieChange={ (newMovie: Movie) => {
            setMovie(newMovie);
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
