import axios from 'axios';
import { HOST } from "../utils/constants.js";

const apiClient = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage before every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { apiClient };
