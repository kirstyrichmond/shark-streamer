import { ModalButtonsContainer, ModalPlayButton, PlayIcon, PauseIcon } from "../styles/MovieModal.styles";
import { WatchlistButton } from "./WatchlistButton";

interface MovieActionButtonsProps {
  movie: {
    id: number | string;
    media_type?: string;
    title?: string;
    name?: string;
    overview?: string;
    release_date?: string;
    first_air_date?: string;
    backdrop_path?: string;
  };
  onPlayPause: () => string | void;
  isPlaying: boolean;
  videoEnded: boolean;
}

export const MovieActionButtons = ({ movie, onPlayPause, isPlaying, videoEnded }: MovieActionButtonsProps) => {
  const showPlayIcon = videoEnded || !isPlaying;

  return (
    <ModalButtonsContainer>
      <ModalPlayButton onClick={ onPlayPause }>
        { showPlayIcon ? <PlayIcon /> : <PauseIcon /> }
        { showPlayIcon ? "Play" : "Pause" }
      </ModalPlayButton>
      <WatchlistButton movie={ movie } />
    </ModalButtonsContainer>
  );
};
