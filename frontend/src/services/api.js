import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  updatePortfolio: (data) => api.post('/portfolio', data),
  addStock: (stockData) => api.post('/portfolio/add-stock', stockData),
  removeStock: (symbol) => api.delete(`/portfolio/remove-stock/${symbol}`),
  getAIAnalysis: () => api.get('/portfolio/ai-analysis'),
  explainTrend: (symbol) => api.get(`/portfolio/explain-trend/${symbol}`),
};

export default api;