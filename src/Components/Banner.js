import React, { useEffect, useState } from "react";
import requests, { API_KEY } from "../Requests";
import axios from "../axios";
import { MovieModal } from "./MovieModal";
import {
  BannerContainer,
  BannerContent,
  BannerDescription,
  BannerTitle,
  BottomFade,
  ButtonsContainer,
  InfoButton,
  InfoIcon,
  PlayButton,
  PlayIcon,
} from "../styles/Banner.styles";

export const Banner = () => {
  const { innerWidth: screenWidth } = window;
  const [movie, setMovie] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [openMovieModal, setOpenMovieModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      const type = movie?.media_type === "tv" ? "tv" : "movie";
      const request = await axios
        .get(
          `https://api.themoviedb.org/3/${type}/${movie?.id}/videos?api_key=${API_KEY}`
        )
        .then((res) => {
          setVideos(res.data.results);
        });
      return request;
    }
    fetchVideos();
  }, [movie]);

  const truncateAmount = screenWidth < 1280 ? 82 : 158;

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " ..." : string;
  };

  const renderTrailer = () => {
    const trailer = videos?.find((vid) => vid.type === "Trailer");

    const trailerHeight = screenWidth < 744 ? "380px" : "984px";

    return (
      <div>
        <iframe
          title={movie?.title || movie?.name || movie?.original_name}
          width="100%"
          height={trailerHeight}
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&showinfo=0&modestbranding=1&mute=1&rel=0`}
          frameBorder="0"
          allowFullscreen
        ></iframe>
      </div>
    );
  };

  return (
    <>
      <MovieModal
        selectedMovie={movie}
        isOpen={openMovieModal}
        handleClose={setOpenMovieModal}
      />
      {playTrailer ? (
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
            <BannerTitle>
              {movie?.title || movie?.name || movie?.original_name}
            </BannerTitle>
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
          {/* <BottomFade /> */}
        </BannerContainer>
      )}
    </>
  );
};
