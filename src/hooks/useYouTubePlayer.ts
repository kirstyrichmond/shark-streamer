import { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubePlayer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const youtubePlayerRef = useRef<YouTube | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobile(isMobileDevice);
    
    if (window.YT) return;
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    window.onYouTubeIframeAPIReady = function() {
      console.log('YouTube API is ready');
    };
    
    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsPlaying(false);
  };

  const handleVideoStateChange = (event: YouTubeEvent<number>) => {
    try {
      const state = event.target.getPlayerState();
      setIsPlaying(state === 1);
      if (state === 0) {
        setVideoEnded(true);
      }
    } catch (error) {
      console.error('Failed to get player state:', error);
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
      autoplay: 1 as 0 | 1,
      mute: 1,
      controls: 0 as 0 | 1,
      showinfo: 0,
      modestbranding: 1 as 1,
      rel: 0 as 0 | 1 | undefined,
      iv_load_policy: 3 as 1 | 3 | undefined,
      fs: 0 as 0 | 1 | undefined,
      disablekb: 1 as 0 | 1 | undefined,
      playsinline: 1 as 0 | 1 | undefined,
      origin: window.location.origin,
      enablejsapi: 1,
      widget_referrer: window.location.href,
    },
  });

  interface YouTubePlayerReadyEvent {
    target: {
      mute: () => void;
      playVideo: () => void;
    };
  }

  const handleVideoReady = (event: YouTubePlayerReadyEvent) => {
    event.target.mute();
    setIsMuted(true);
    
    setTimeout(() => {
      try {
        event.target.playVideo();
        setIsPlaying(true);
      } catch (e) {
        setIsPlaying(false);
      }
    }, 100);
  };

  const resetPlayer = () => {
    setVideoEnded(false);
    setIsPlaying(false);
  };

  return {
    isPlaying,
    videoEnded,
    isMuted,
    isMobile,
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