import apiClient from './apiClient';

/**
 * Authentication API endpoints
 */
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
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
  getLeaderboard: (page = 1, limit = 50) =>
    apiClient.get('/leaderboard', { params: { page, limit } }),
  getUserStats: () => apiClient.get('/leaderboard/stats'),
};

/**
 * Product API endpoints
 */
export const productApi = {
  getProducts: () => apiClient.get('/products'),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};
