import React, { useEffect, useState, useRef } from "react";
import requests, { API_KEY } from "../Requests";
import axios from "../axios";
import { MovieModal } from "./MovieModal";
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
  const [isMuted, setIsMuted] = useState(true);
  const youtubePlayerRef = useRef(null);

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

  useEffect(() => {
    if (playTrailer && videos.length > 0) {
      const checkForIframe = setInterval(() => {
        if (document.getElementById('banner-trailer-iframe')) {
          clearInterval(checkForIframe);
          
          const connectOnLoad = () => {
            if (window.YT && window.YT.Player) {
              if (youtubePlayerRef.current) return;
              
              const iframe = document.getElementById('banner-trailer-iframe');
              if (iframe) {
                try {
                  youtubePlayerRef.current = new window.YT.Player('banner-trailer-iframe', {
                    events: {
                      'onReady': (event) => {
                        console.log('Banner YouTube player ready');
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
    } else {
      youtubePlayerRef.current = null;
    }
  }, [playTrailer, videos]);

  const truncateAmount = screenWidth < 1280 ? 82 : 158;

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " ..." : string;
  };

  const toggleMute = () => {
    if (youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        youtubePlayerRef.current.mute();
        setIsMuted(true);
      }
    } else {
      const iframe = document.getElementById('banner-trailer-iframe');
      if (iframe) {
        try {
          const message = isMuted 
            ? JSON.stringify({ event: 'command', func: 'unMute' })
            : JSON.stringify({ event: 'command', func: 'mute' });
          
          iframe.contentWindow.postMessage(message, '*');
          setIsMuted(!isMuted);
        } catch (e) {
          console.error('Failed to control YouTube player:', e);
        }
      }
    }
  };

  const renderTrailer = () => {
    const trailer = videos?.find((vid) => vid.type === "Trailer") || videos[0];
    
    if (!trailer) return null;

    return (
      <BannerPlayerWrapper>
        <div className="youtube-wrapper">
          <iframe
            id="banner-trailer-iframe"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
            title="Banner Trailer"
            frameborder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
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
            <PlayButton onClick={() => setOpenMovieModal(true)}>
              <PlayIcon
                src="https://img.icons8.com/ios-glyphs/100/000000/play--v1.png"
                alt="play movie"
              />
              Play
            </PlayButton>
            <InfoButton onClick={() => setOpenMovieModal(true)}>
              <InfoIcon
                src="https://img.icons8.com/pastel-glyph/64/FFFFFF/info--v1.png"
                alt="more movie info"
              />
              More Info
            </InfoButton>
          </ButtonsContainer>
        </BannerContent>
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
              <PlayButton onClick={() => setPlayTrailer(true)}>
                <PlayIcon
                  src="https://img.icons8.com/ios-glyphs/100/000000/play--v1.png"
                  alt="play movie"
                />
                Play
              </PlayButton>
              <InfoButton onClick={() => setOpenMovieModal(true)}>
                <InfoIcon
                  src="https://img.icons8.com/pastel-glyph/64/FFFFFF/info--v1.png"
                  alt="more movie info"
                />
                More Info
              </InfoButton>
            </ButtonsContainer>
          </BannerContent>
        </BannerContainer>
      )}
    </>
  );
};
