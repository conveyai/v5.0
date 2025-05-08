import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to set auth token and tenant domain
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Set tenant domain from local storage
    const tenantDomain = localStorage.getItem('tenantDomain');
    if (tenantDomain) {
      config.headers['x-tenant-domain'] = tenantDomain;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('tenantDomain');
      
      // Show error toast
      toast.error('Your session has expired. Please log in again.');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden errors
    if (error.response && error.response.status === 403) {
      toast.error('You do not have permission to access this resource.');
    }
    
    // Handle 500 Internal Server errors
    if (error.response && error.response.status >= 500) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default api;