import { useState, useEffect } from "react";
import { movieAPI } from "../services/api";
import { useMovieFiltering } from "./useMovieFiltering";

interface MovieLogo {
  file_path: string;
  aspect_ratio: number;
  iso_639_1: string;
}

interface MovieVideo {
  id?: string;
  key: string;
  name: string;
  type: string;
  site: string;
  official: boolean;
}

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  runtime?: number;
  episode_run_time?: number[];
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  release_dates?: {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{
        certification: string;
        type: number;
      }>;
    }>;
  };
  content_ratings?: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}

interface CastAndCrew {
  cast: CastMember[];
  crew: CrewMember[];
}

interface SimilarMovie {
  id: number | string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
}

interface UseMovieModalProps {
  movieId: string | number | undefined;
  movieType: string;
  isEnabled?: boolean;
}

export const useMovieModal = ({ movieId, movieType, isEnabled = true }: UseMovieModalProps) => {
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [logos, setLogos] = useState<MovieLogo[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [castAndCrew, setCastAndCrew] = useState<CastAndCrew | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { filterMovies } = useMovieFiltering();

  useEffect(() => {
    if (!movieId || !isEnabled) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [videosResponse, imagesResponse, detailsResponse, creditsResponse, similarResponse] = await Promise.all([
          movieAPI.fetchVideos(movieType, String(movieId)),
          movieAPI.fetchImages(movieType, String(movieId)),
          movieAPI.fetchMovieDetails(movieType, String(movieId)),
          movieAPI.fetchCredits(movieType, String(movieId)),
          movieAPI.fetchSimilar(movieType, String(movieId)),
        ]);

        if (movieType === "movie") {
          const ratingsResponse = await movieAPI.fetchReleaseDates(String(movieId));
          detailsResponse.data.release_dates = ratingsResponse.data;
        } else {
          const ratingsResponse = await movieAPI.fetchContentRatings(String(movieId));
          detailsResponse.data.content_ratings = ratingsResponse.data;
        }

        setVideos(videosResponse.data.results || []);
        setLogos(imagesResponse.data.logos || []);
        setMovieDetails(detailsResponse.data);
        setCastAndCrew(creditsResponse.data);

        const rawSimilarMovies = similarResponse.data.results || [];
        const filteredSimilarMovies = await filterMovies(
          rawSimilarMovies,
          {
            maxMovies: 15,
            resultLimit: 6,
          },
          movieType
        );
        setSimilarMovies(filteredSimilarMovies);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch movie data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [movieId, movieType, isEnabled, filterMovies]);

  const getOfficialTrailer = () => {
    return videos.find((video) => video.type === "Trailer" && video.site === "YouTube" && video.official);
  };

  const getEnglishLogo = () => {
    return logos.find((logo) => logo.iso_639_1 === "en") || logos[0];
  };

  const getDirector = () => {
    return castAndCrew?.crew.find((person) => person.job === "Director");
  };

  const getMainCast = (limit = 5) => {
    return castAndCrew?.cast.slice(0, limit) || [];
  };

  const getRuntime = () => {
    if (!movieDetails?.runtime) return null;
    const hours = Math.floor(movieDetails.runtime / 60);
    const minutes = movieDetails.runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getGenres = () => {
    return movieDetails?.genres.map((genre) => genre.name).join(", ") || "";
  };

  const hasVideos = videos.length > 0;
  const hasLogos = logos.length > 0;

  return {
    videos,
    logos,
    movieDetails,
    castAndCrew,
    similarMovies,
    isLoading,
    error,
    hasVideos,
    hasLogos,
    getOfficialTrailer,
    getEnglishLogo,
    getDirector,
    getMainCast,
    getRuntime,
    getGenres,
  };
};
