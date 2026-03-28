import { useState, useCallback } from 'react';
import { authApi } from '../api/endpoints';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (username, email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({
        username,
        email,
        password,
        displayName,
      });
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.getProfile();
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, login, getProfile, loading, error };
};
