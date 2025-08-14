import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/userSlice";
import Layout from "./Components/Layout";
import { SearchProvider } from "./context/SearchContext";

function App() {
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
          <Layout />
        </BrowserRouter>
      </SearchProvider>
    </div>
  );
}

export default App;
