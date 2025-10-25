import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./store/slices/userSlice";
import Layout from "./Components/Layout";
import { SearchProvider } from "./context/SearchContext";
import { AppDispatch } from "./app/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('shark_streamer_token');
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
