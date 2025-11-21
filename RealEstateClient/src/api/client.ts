import axios from 'axios';

// Axios client configured for APigee API gateway
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY || '' // APigee API key
  }
});

export default apiClient;