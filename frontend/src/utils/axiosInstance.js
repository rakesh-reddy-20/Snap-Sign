import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized: token expired or not logged in
        window.location.href = "/login";
      } else if (status === 500) {
        console.error("Server error, please try again later!");
      }
    } else if (error.code === "ECONNABORTED") {
      console.log("Request timeout, please try again!");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
