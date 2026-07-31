import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.patch('/messages/read', { conversationId });
    return response.data;
  },
};

export default messageService;
