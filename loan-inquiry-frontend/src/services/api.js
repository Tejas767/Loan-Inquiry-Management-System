import axios from "axios";

// Create a pre-configured Axios instance
const instance = axios.create({
  baseURL: "http://localhost:8080", // Backend base URL
});

// Request interceptor: attach JWT token to every request if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Add Authorization header: Bearer <token>
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
