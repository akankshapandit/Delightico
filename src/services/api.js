import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const API = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
API.interceptors.request.use(
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

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Order API functions
export const orderAPI = {
  getOrderById: async (orderId) => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await API.get('/orders/user-orders');
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  }
};

export default API;