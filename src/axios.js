import axios from "axios";
import { API_KEY } from "./Requests";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY
  }
});

export default instance;