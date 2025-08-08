import { useState, useRef, useEffect } from 'react';

export const useYouTubePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
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

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsPlaying(false);
  };

  const handleVideoStateChange = (event) => {
    const state = event.target.getPlayerState();
    setIsPlaying(state === 1);
    if (state === 0) {
      setVideoEnded(true);
    }
  };

  const handlePlayPause = () => {
    if (videoEnded) {
      setVideoEnded(false);
      setIsPlaying(true);
      return 'restart';
    } else {
      const player = youtubePlayerRef.current?.internalPlayer;
      if (player) {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }
      return isPlaying ? 'pause' : 'play';
    }
  };

  const toggleMute = () => {
    const player = youtubePlayerRef.current?.internalPlayer;
    
    if (player) {
      try {
        if (isMuted) {
          player.unMute();
        } else {
          player.mute();
        }
        setIsMuted(!isMuted);
      } catch (e) {
        console.error('Failed to control YouTube player:', e);
      }
    }
  };

  const getYouTubeOptions = () => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
      playsinline: 1,
    },
  });

  const handleVideoReady = (event) => {
    event.target.mute();
    setIsMuted(true);
  };

  const resetPlayer = () => {
    setVideoEnded(false);
    setIsPlaying(true);
  };

  return {
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
  };
};