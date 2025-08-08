import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import requests, { API_KEY } from "../Requests";
import axios from "../axios";
import { MovieModal } from "./MovieModal";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
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
  MovieIcon
} from "../styles/Banner.styles";

export const Banner = () => {
  const { innerWidth: screenWidth } = window;
  const [movie, setMovie] = useState([]);
  const [logo, setLogo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [openMovieModal, setOpenMovieModal] = useState(false);
  
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
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchTrending);
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
        const request = await axios.get(
          `https://api.themoviedb.org/3/${type}/${movie?.id}/videos?api_key=${API_KEY}`
        );
        
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
        const request = await axios.get(
          `https://api.themoviedb.org/3/${type}/${movie?.id}/images?api_key=${API_KEY}`
        );
        
        if (request.data.logos && request.data.logos.length > 0) {
          const englishLogo = request.data.logos.find(logo => 
            logo.iso_639_1 === 'en' || logo.iso_639_1 === null
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


  const truncateAmount = screenWidth < 1280 ? 82 : 158;

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " ..." : string;
  };

  const handlePlayPauseAction = () => {
    const action = handlePlayPause();
    if (action === 'restart') {
      setPlayTrailer(true);
    }
  };


  const renderBannerContent = (showPlayButton = true, onPlayClick = null) => (
    <BannerContent>
      {logo ? (
        <MovieIcon 
          src={`https://image.tmdb.org/t/p/original/${logo}`} 
          alt={movie?.title || movie?.name || movie?.original_name}
        />
      ) : (
        <BannerTitle>
          {movie?.title || movie?.name || movie?.original_name}
        </BannerTitle>
      )}
      <BannerDescription>
        {truncate(movie?.overview, truncateAmount)}
      </BannerDescription>
      <ButtonsContainer>
        {showPlayButton && (
          <PlayButton onClick={onPlayClick || handlePlayPauseAction}>
            {videoEnded || !isPlaying ? <PlayIcon /> : <PauseIcon />}
            {videoEnded || !isPlaying ? "Play" : "Pause"}
          </PlayButton>
        )}
        <InfoButton onClick={() => setOpenMovieModal(true)}>
          <InfoIcon
            src="https://img.icons8.com/pastel-glyph/64/FFFFFF/info--v1.png"
            alt="more movie info"
          />
          More Info
        </InfoButton>
      </ButtonsContainer>
    </BannerContent>
  );

  const renderTrailer = () => {
    const trailer = videos?.find((vid) => vid.type === "Trailer") || videos[0];
    
    if (!trailer) return null;

    if (videoEnded) {
      return (
        <BannerContainer
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {renderBannerContent()}
        </BannerContainer>
      );
    }

    return (
      <BannerPlayerWrapper>
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
        {renderBannerContent()}
        <CustomMuteButton onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </CustomMuteButton>
      </BannerPlayerWrapper>
    );
  };

  return (
    <>
      <MovieModal
        selectedMovie={movie}
        isOpen={openMovieModal}
        handleClose={setOpenMovieModal}
        onMovieChange={(newMovie) => {
          setMovie(newMovie);
        }}
      />
      {playTrailer && videos?.length > 0 ? (
        renderTrailer()
      ) : (
        <BannerContainer
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {renderBannerContent(true, () => {
            setPlayTrailer(true);
            resetPlayer();
          })}
        </BannerContainer>
      )}
    </>
  );
};
