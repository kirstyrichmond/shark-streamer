import { MovieCoverImage } from "../styles/MovieModal.styles";

interface MovieCoverProps {
  movie: {
    title?: string;
    name?: string;
    backdrop_path?: string;
  };
  baseUrl: string;
}

export const MovieCover = ({ movie, baseUrl }: MovieCoverProps) => {
  const movieTitle = movie?.title || movie?.name || "";

  return <MovieCoverImage src={ `${baseUrl}${movie?.backdrop_path || ""}` } alt={ movieTitle } />;
};
