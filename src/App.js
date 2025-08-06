import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomeScreen } from "./Components/HomeScreen";
import { LoginScreen } from "./Components/LoginScreen";
import { AccountScreen } from "./Components/AccountScreen";
import { ChangePlanScreen } from "./Components/ChangePlanScreen";
import { Profiles } from "./Components/Profiles";
import { ManageProfile } from "./Components/ManageProfile";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, selectUser } from "./features/userSlice";
import Layout from "./Components/Layout";
import { SearchProvider } from "./context/SearchContext";
import AuthGuard from "./Components/AuthGuard";
import { RoutePaths } from "./router/types";

function App() {
  const [selectedMovie, setSelectedMovie] = useState({});
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('netflix_token');
      if (token) {
        dispatch(getCurrentUser());
      }
    };
    
    checkAuthToken();
  }, [dispatch]);

  return (
    <div className="app" id="root">
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route 
                index 
                element={
                  user.info ? (
                    <HomeScreen
                      selectedMovie={selectedMovie}
                      setSelectedMovie={setSelectedMovie}
                    />
                  ) : (
                    <LoginScreen />
                  )
                } 
              />
              <Route 
                path={RoutePaths.Account} 
                element={
                  <AuthGuard>
                    <AccountScreen />
                  </AuthGuard>
                } 
              />
              <Route 
                path={RoutePaths.ChangePlan} 
                element={
                  <AuthGuard>
                    <ChangePlanScreen />
                  </AuthGuard>
                } 
              />
              <Route 
                path={RoutePaths.Profiles} 
                element={
                  <AuthGuard>
                    <Profiles />
                  </AuthGuard>
                } 
              />
              <Route 
                path={RoutePaths.ManageProfile} 
                element={
                  <AuthGuard>
                    <ManageProfile />
                  </AuthGuard>
                } 
              />
              <Route 
                path={RoutePaths.AddProfile} 
                element={
                  <AuthGuard>
                    <ManageProfile isCreating={true} setEditProfilePage={() => window.location.href = '/'} />
                  </AuthGuard>
                } 
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </div>
  );
}

export default App;
