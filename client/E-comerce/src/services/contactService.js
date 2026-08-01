import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically add Bearer token to requests
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

export const contactService = {
  submitContactForm: async (formData) => {
    const response = await api.post('/contacts', formData);
    return response.data;
  },
  
  getContactMessages: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },
};

export default contactService;
