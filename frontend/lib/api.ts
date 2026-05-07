import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies for refresh token
});

// Attach access token from localStorage (if present)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401 -> try refresh
api.interceptors.response.use((res) => res, async (err) => {
  const originalRequest = err.config;
  if (err.response && err.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const resp = await api.post('/auth/refresh');
      const newToken = resp.data && resp.data.data && resp.data.data.token;
      if (newToken) {
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
  return Promise.reject(err);
});

export default api;

export { sendGymEmail } from './sendGymEmail';
