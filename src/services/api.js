import axios from 'axios';

const api = axios.create({
  baseURL: 'https://medicwatch-core-backend.onrender.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dispatch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error('Tenant Boundary Action: Workspace plane lock detected.');
      localStorage.removeItem('dispatch_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;