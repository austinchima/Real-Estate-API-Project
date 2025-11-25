import axios from 'axios';

// Axios client configured for API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://13.220.170.69/api',
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY && { 'x-api-key': import.meta.env.VITE_API_KEY })
  }
});

export default apiClient;