import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import "./App.css";

import { HomeScreen } from "./Components/HomeScreen";
import { LoginScreen } from "./Components/LoginScreen";
import { AccountScreen } from "./Components/AccountScreen";
import { ChangePlanScreen } from "./Components/ChangePlanScreen";
import { Profiles } from "./Components/Profiles";
import { AddProfileScreen } from "./Components/AddProfileScreen";
import { ManageProfile } from "./Components/ManageProfile";
import SearchScreen from "./Components/SearchScreen";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser, profiles } from "./features/userSlice";
import Layout from "./Components/Layout";
import { SearchProvider } from "./context/SearchContext"; // Import the SearchProvider

function App() {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [showSignUpScreen, setShowSignUpScreen] = useState(false);
  const [showSignInScreen, setShowSignInScreen] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Debug state changes
  console.log("App state:", { 
    showSignInScreen, 
    showSignUpScreen, 
    userLoggedIn: user?.info ? true : false
  });

  // Direct handlers for auth state
  const handleSignUpClick = () => {
    console.log("Setting showSignUpScreen to true");
    setShowSignUpScreen(true);
    setShowSignInScreen(false);
  };

  const handleSignInClick = () => {
    console.log("Setting showSignInScreen to true");
    setShowSignInScreen(true);
    setShowSignUpScreen(false);
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        console.log("Auth state changed - User logged in:", userAuth.email);
        
        // Clear sign in/up screens when user is authenticated
        setShowSignInScreen(false);
        setShowSignUpScreen(false);

        // Dispatch login action to Redux
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
        
        // Set default profiles if none exist
        if (!user.profiles || user.profiles.length === 0) {
          dispatch(
            profiles([
              { 
                id: 1, 
                name: "User 1", 
                activeProfile: true 
              }
            ])
          );
        }
      } else {
        console.log("Auth state changed - User logged out");
        dispatch(logout());
      }
    });
    
    // Clean up subscription
    return unsubscribe;
  }, [dispatch]);

  // Create a router using JSX syntax with direct state management
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route 
        path="/" 
        element={
          <Layout 
            showSignInScreen={showSignInScreen}
            setShowSignInScreen={handleSignInClick}
            setShowSignUpScreen={handleSignUpClick}
          />
        }
      >
        {!user.info ? (
          <Route 
            index 
            element={
              <LoginScreen 
                showSignInScreen={showSignInScreen}
                showSignUpScreen={showSignUpScreen}
                setShowSignUpScreen={handleSignUpClick}
                setShowSignInScreen={handleSignInClick}
              />
            } 
          />
        ) : (
          <>
            <Route 
              index 
              element={
                <HomeScreen
                  selectedMovie={selectedMovie}
                  setSelectedMovie={setSelectedMovie}
                />
              } 
            />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/change-plan" element={<ChangePlanScreen />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/manage-profile" element={<ManageProfile />} />
            <Route path="/add-profile" element={<AddProfileScreen />} />
          </>
        )}
      </Route>
    )
  );

  return (
    <div className="app" id="root">
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </div>
  );
}

export default App;
