import axios from "axios";

// Dynamic API base URL for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.up.railway.app/api'  // Will be updated after backend deployment
    : 'http://localhost:5000/api'
  );

const API = axios.create({ baseURL: API_BASE_URL });

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);


// Attach token if available
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Global response error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response)
    if (!error.response) {
      return Promise.reject({
        isNetworkError: true,
        message: "Network Error. Please check your connection and try again.",
      });
    }
    // 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject({
        isAuthError: true,
        message: "Session expired. Please log in again.",
      });
    }
    // 500 Internal Server Error
    if (error.response.status === 500) {
      return Promise.reject({
        isServerError: true,
        message: "Server error. Please try again later.",
      });
    }
    // Other API error
    return Promise.reject(error);
  }
);

export default API;
