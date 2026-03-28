import apiClient from '../api/apiClient';

/**
 * Authentication Service
 */
export const authService = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),

  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('user'),

  isAuthenticated: () => !!localStorage.getItem('token'),
};

/**
 * Negotiation Service
 */
export const negotiationService = {
  calculateDiscount: (initialPrice, finalPrice) => {
    return initialPrice - finalPrice;
  },

  calculateDiscountPercentage: (initialPrice, finalPrice) => {
    return ((initialPrice - finalPrice) / initialPrice * 100).toFixed(2);
  },

  calculateScore: (finalPrice, discount) => {
    return finalPrice - discount;
  },
};

/**
 * Utility Service
 */
export const utilService = {
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
};
