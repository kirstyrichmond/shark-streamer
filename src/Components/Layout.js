import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { Nav } from './Nav';
import { useSearch } from '../context/SearchContext'; // Import the context hook

const Layout = ({ showSignInScreen, setShowSignInScreen, setShowSignUpScreen }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const searchContext = useSearch(); // Use the search context
  
  // Debug log
  console.log("Layout rendering, search context:", searchContext);
  console.log("Current user state:", user);
  console.log("Current location:", location.pathname);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!user.info && location.pathname !== '/') {
      console.log("No user info, redirecting to root");
      navigate('/');
    }
  }, [user.info, location.pathname, navigate]);

  // Handle Sign In button click in Nav
  const handleSignInClick = () => {
    console.log("Sign In click handled in Layout");
    setShowSignInScreen(true);
    setShowSignUpScreen(false);
  };

  return (
    <>
      <Nav 
        setShowSignInScreen={setShowSignInScreen}
        setShowSignUpScreen={setShowSignUpScreen}
        handleSignInClick={handleSignInClick}
      />
      <Outlet />
    </>
  );
};

export default Layout;
