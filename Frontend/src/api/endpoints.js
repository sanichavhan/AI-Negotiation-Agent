import apiClient from './apiClient';

/**
 * Authentication API endpoints
 */
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'), // Get current user details
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

/**
 * Negotiation API endpoints
 */
export const negotiationApi = {
  startSession: (data) => apiClient.post('/negotiation/start', data),
  sendMessage: (sessionId, data) =>
    apiClient.post(`/negotiation/${sessionId}/message`, data),
  getSession: (sessionId) => apiClient.get(`/negotiation/${sessionId}`),
  acceptDeal: (sessionId) => apiClient.post(`/negotiation/${sessionId}/accept`, {}),
  abandonSession: (sessionId) =>
    apiClient.post(`/negotiation/${sessionId}/abandon`, {}),
  getSessionHistory: () => apiClient.get('/negotiation/history'),
};

/**
 * Leaderboard API endpoints
 */
export const leaderboardApi = {
  getLeaderboard: (page = 1, limit = 50, sortBy = 'totalSavings', timeframe = 'all') =>
    apiClient.get('/leaderboard', { params: { page, limit, sortBy, timeframe } }),
  getUserStats: () => apiClient.get('/leaderboard/stats'),
  getRecentPurchases: (page = 1, limit = 50) =>
    apiClient.get('/leaderboard', { params: { page, limit, sortBy: 'recent' } }),
};

/**
 * Product API endpoints
 */
export const productApi = {
  // Get all products
  getProducts: () => apiClient.get('/products'),
  
  // Get product by ID
  getProductById: (id) => apiClient.get(`/products/${id}`),
  
  // Get available clothing products for negotiation
  getAvailableClothing: (count = 6) =>
    apiClient.get('/products/available/clothing', { params: { count } }),
  
  // Get products by category
  getByCategory: (category, count = 6) =>
    apiClient.get(`/products/category/${category}`, { params: { count } }),
  
  // Get all available categories
  getCategories: () => apiClient.get('/products/categories'),
  
  // Refresh product cache
  refreshCache: () => apiClient.get('/products/admin/refresh'),
};
