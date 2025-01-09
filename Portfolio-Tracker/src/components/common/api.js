import axios from "axios";

const API_URL = import.meta.env.VITE_API_GOOGLE_BASE_URL;

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: `${API_URL}/api/`, // Replace with your actual backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to authenticate with Google using the provided authorization code
export const googleAuth = (code) => api.get(`/google?code=${code}`);
