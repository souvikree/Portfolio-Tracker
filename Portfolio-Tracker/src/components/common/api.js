import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your actual backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to authenticate with Google using the provided authorization code
export const googleAuth = (code) => api.get(`/google?code=${code}`);
