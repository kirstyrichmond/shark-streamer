import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { HomeScreen } from "./Components/HomeScreen";
import { LoginScreen } from "./Components/LoginScreen";
import { Nav } from "./Components/Nav";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { AccountScreen } from "./Components/AccountScreen";
import { ChangePlanScreen } from "./Components/ChangePlanScreen";
import { Profiles } from "./Components/Profiles";
import { AddProfileScreen } from "./Components/AddProfileScreen";
import axios from "axios";
import { ManageProfile } from "./Components/ManageProfile";
import SearchScreen from "./Components/SearchScreen";
import { API_KEY } from "./Requests";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [showSignInScreen, setShowSignInScreen] = useState(false);
  const [showSignUpScreen, setShowSignUpScreen] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        setShowSignInScreen(false);
        setShowSignUpScreen(false);

        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  async function fetchMovies(searchKey) {
    const type = searchKey ? "search" : "discover";

    const request = await axios.get(
      `https://api.themoviedb.org/3/${type}/movie?api_key=${API_KEY}${
        type === "search" && `&query=${searchKey}`
      }`
    );
    setMovies(request.data.results);
    return request;
  }

  const searchMovies = useCallback(() => {
    fetchMovies(searchKey);
  }, [searchKey]);

  useEffect(() => {
    fetchMovies();
    searchMovies();
  }, [searchKey, searchMovies]);

  return (
    <div className="app">
      <BrowserRouter>
        <Nav
          showSearchBar={showSearchBar}
          setShowSearchBar={setShowSearchBar}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          searchMovies={searchMovies}
          showSignInScreen={showSignInScreen}
          setShowSignInScreen={setShowSignInScreen}
          setShowSignUpScreen={setShowSignUpScreen}
        />

        <Routes>
          {!user.info ? (
            <Route
              exact
              path="/"
              element={
                <LoginScreen
                  showSignInScreen={showSignInScreen}
                  showSignUpScreen={showSignUpScreen}
                  setShowSignUpScreen={setShowSignUpScreen}
                />
              }
            />
          ) : (
            <>
              <Route
                exact
                path="/"
                element={
                  searchKey && showSearchBar ? (
                    <SearchScreen
                      movies={movies}
                      setSelectedMovie={setSelectedMovie}
                      selectedMovie={selectedMovie}
                    />
                  ) : (
                    <HomeScreen
                      selectedMovie={selectedMovie}
                      setSelectedMovie={setSelectedMovie}
                    />
                  )
                }
              />
              <Route exact path="/account" element={<AccountScreen />} />
              <Route exact path="/change-plan" element={<ChangePlanScreen />} />
              <Route exact path="/profiles" element={<Profiles />} />
              <Route exact path="/manage-profile" element={<ManageProfile />} />
              <Route exact path="/add-profile" element={<AddProfileScreen />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
