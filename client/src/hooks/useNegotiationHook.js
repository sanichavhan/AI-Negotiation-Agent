import { useState, useCallback } from 'react';
import { negotiationApi } from '../api/endpoints';

export const useNegotiationHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startSession = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationApi.startSession({ productId });
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (sessionId, message, userOffer = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationApi.sendMessage(sessionId, {
        message,
        userOffer,
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

  const acceptDeal = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationApi.acceptDeal(sessionId);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSession = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationApi.getSession(sessionId);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { startSession, sendMessage, acceptDeal, getSession, loading, error };
};
