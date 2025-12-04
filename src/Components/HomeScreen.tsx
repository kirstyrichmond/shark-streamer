import { movieAPI } from "../services/api";
import { Banner } from "./Banner";
import { useSearch } from "../hooks/useSearch";
import SearchScreen from "./SearchScreen";
import Row from "./Row";

export const HomeScreen = () => {
  const { isSearching } = useSearch();

  if (isSearching) {
    return <SearchScreen />;
  }

  return (
    <>
      <Banner />
      <Row title="SHARK STREAMER ORIGINALS" fetchRequest={ movieAPI.fetchSharkStreamerOriginals } isLargeRow />
      <Row title="Trending Now" fetchRequest={ movieAPI.fetchTrending } />
      <Row title="Top Rated" fetchRequest={ movieAPI.fetchTopRated } />
      <Row title="My List" isWatchlist />
      <Row title="Action Movies" fetchRequest={ movieAPI.fetchActionMovies } />
      <Row title="Comedy Movies" fetchRequest={ movieAPI.fetchComedyMovies } />
      <Row title="Horror Movies" fetchRequest={ movieAPI.fetchHorrorMovies } />
      <Row title="Romance Movies" fetchRequest={ movieAPI.fetchRomanceMovies } />
      <Row title="Documentaries" fetchRequest={ movieAPI.fetchDocumentaries } />
    </>
  );
};
