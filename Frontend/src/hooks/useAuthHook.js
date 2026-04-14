import { useState, useCallback } from 'react';
import { authApi } from '../api/endpoints';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (username, email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Registering user:', { username, email });
      const response = await authApi.register({
        username,
        email,
        password,
        displayName,
      });
      console.log('✅ Registration response:', response.data);
      // Handle both response structures
      const userData = response.data.data || response.data;
      console.log('✅ Returning user data:', userData);
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error('❌ Registration error:', errorMsg);
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
      console.log('🔐 Logging in user:', { email });
      const response = await authApi.login({ email, password });
      console.log('✅ Login response:', response.data);
      // Handle both response structures
      const userData = response.data.data || response.data;
      console.log('✅ Returning user data:', userData);
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error('❌ Login error:', errorMsg);
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
      console.log('👤 Fetching user profile');
      const response = await authApi.getProfile();
      console.log('✅ Profile response:', response.data);
      // Handle both response structures
      const userData = response.data.data || response.data;
      console.log('✅ Returning profile data:', userData);
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error('❌ Profile fetch error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, login, getProfile, loading, error };
};
