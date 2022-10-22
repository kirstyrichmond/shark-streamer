import React, { useEffect, useState } from "react";
import Modal from "react-modal";
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
  ReleaseDate,
} from "../styles/MovieModal.styles";
import { API_KEY } from "../Requests";
import axios from "axios";

const customStyles = {
  content: {
    top: "54%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    borderRadius: "12px",
    border: "none",
    zIndex: "100",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
  },
};

export const MovieModal = ({
  isOpen,
  handleClose,
  selectedMovie,
  fetchUrl,
}) => {
  const base_url = "https://image.tmdb.org/t/p/original/";
  const [videos, setVideos] = useState([]);
  const [playTrailer, setPlayTrailer] = useState(false);
  const { innerWidth: screenWidth } = window;
  const type2 = fetchUrl?.includes("tv") ? "tv" : "movie";

  useEffect(() => {
    async function fetchData() {
      const request = await axios
        .get(
          `https://api.themoviedb.org/3/${type2 ?? "movie"}/${
            selectedMovie?.id
          }/videos?api_key=${API_KEY}`
        )
        .then((res) => {
          setVideos(res.data.results);
        });
      return request;
    }
    fetchData();
  }, [selectedMovie?.id]);

  const trailerHeight =
    screenWidth < 744 ? "200px" : screenWidth < 1280 ? "360px" : "400px";

  const rendertrailer = () => {
    const trailer = videos?.find((vid) => vid.type === "Trailer");

    return (
      <div>
        <iframe
          title={
            selectedMovie?.title ||
            selectedMovie?.name ||
            selectedMovie?.original_name
          }
          width="100%"
          height={trailerHeight}
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&showinfo=0&modestbranding=1&mute=1&rel=0`}
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    );
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <ModalContainer>
          <HeaderContainer>
            <CloseButtonContainer>
              <CloseButton
                src="https://img.icons8.com/ios-glyphs/30/000000/macos-close.png"
                onClick={() => {
                  setPlayTrailer(false);
                  handleClose(false);
                }}
              />
            </CloseButtonContainer>

            {!!playTrailer && videos ? (
              rendertrailer()
            ) : (
              <>
                <MovieCoverImage
                  src={`${base_url}${selectedMovie.backdrop_path}`}
                  alt=""
                />
                <MovieTitle>
                  {selectedMovie.title || selectedMovie.name}
                </MovieTitle>
                <PlayButton
                  onClick={(e) => {
                    setPlayTrailer(!playTrailer);
                    e.preventDefault();
                  }}
                >
                  <PlayIcon
                    src="https://img.icons8.com/ios-glyphs/100/000000/play--v1.png"
                    alt="play movie"
                  />
                  Play
                </PlayButton>
              </>
            )}
          </HeaderContainer>
          <MovieInfoContainer>
            <ReleaseDate>
              {selectedMovie?.first_air_date?.substring(
                0,
                selectedMovie.first_air_date.indexOf("-")
              )}
            </ReleaseDate>
            <MovieDescription>{selectedMovie.overview}</MovieDescription>
          </MovieInfoContainer>
        </ModalContainer>
      </Modal>
    </div>
  );
};
