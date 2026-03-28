import { useState, useCallback } from 'react';
import { leaderboardApi } from '../api/endpoints';

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLeaderboard = useCallback(async (page = 1, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardApi.getLeaderboard(page, limit);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardApi.getUserStats();
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getLeaderboard, getUserStats, loading, error };
};
