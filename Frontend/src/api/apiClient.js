import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔗 API URL:', API_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Debug: Log negotiation API calls
  if (config.url.includes('negotiation')) {
    console.log('🔐 API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      tokenPresent: !!token,
      tokenLength: token ? token.length : 0,
    });
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.url.includes('negotiation')) {
    console.warn('⚠️ WARNING: No token for negotiation endpoint:', config.url);
  }
  
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging for all requests
    const errorInfo = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.response?.data?.error?.message || error.message,
      responseData: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    // Log all errors to console for debugging
    console.error(`🔴 API Error [${error.response?.status || 'Network Error'}]:`, errorInfo);

    // Debug 401 errors
    if (error.response?.status === 401) {
      console.error('🔴 401 UNAUTHORIZED:', {
        url: error.config?.url,
        message: error.response?.data?.error?.message,
        tokenPresent: !!localStorage.getItem('token'),
      });
      
      const currentPath = window.location.pathname;
      // Don't auto-redirect on negotiation routes
      if (!currentPath.includes('/negotiation')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
