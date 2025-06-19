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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export { apiClient };
