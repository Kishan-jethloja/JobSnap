import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Resume API calls
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyResume: () => api.get('/resume/my-resume'),
  download: (id) => api.get(`/resume/resume/${id}/download`, {
    responseType: 'blob'
  }),
};

// Jobs API calls
export const jobsAPI = {
  fetchJobs: (params) => api.get('/jobs/fetch', { params }),
  matchJobs: () => api.post('/jobs/match'),
  getMatchedJobs: (params) => api.get('/jobs/match', { params }),
  searchJobs: (params) => api.get('/jobs/search', { params }),
  getAllJobs: (params) => api.get('/jobs/all', { params }),
};

// Premium API calls
export const premiumAPI = {
  upgrade: (plan) => api.post('/premium/upgrade', { plan }),
  getStatus: () => api.get('/premium/status'),
  cancel: () => api.post('/premium/cancel'),
};

// Email API calls
export const emailAPI = {
  sendSelectedJobs: (selectedJobs) => api.post('/email/sendSelectedJobs', { selectedJobs }),
  getHistory: () => api.get('/email/history'),
  getStats: () => api.get('/email/stats'),
};

// Gmail API calls
export const gmailAPI = {
  getAuthUrl: () => api.get('/gmail/auth-url'),
  handleCallback: (code) => api.post('/gmail/auth-callback', { code }),
  getStatus: () => api.get('/gmail/status'),
  createDrafts: (jobs) => api.post('/gmail/create-drafts', { jobs }),
  getDrafts: () => api.get('/gmail/drafts'),
  disconnect: () => api.delete('/gmail/disconnect'),
};

export default api;
