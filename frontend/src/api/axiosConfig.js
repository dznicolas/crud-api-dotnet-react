import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7272';

const api = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
