import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://js-fitness.onrender.com/api',
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
  
  // Do not try to refresh if the request was to login or refresh itself
  const isAuthRequest = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh');
  
  if (err.response && err.response.status === 401 && !originalRequest._retry && !isAuthRequest) {
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
