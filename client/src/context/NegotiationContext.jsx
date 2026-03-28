import React, { createContext, useContext, useState, useCallback } from 'react';

const NegotiationContext = createContext();

export const NegotiationProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback((session) => {
    setCurrentSession(session);
    setMessages([]);
    setRoundNumber(0);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const incrementRound = useCallback(() => {
    setRoundNumber((prev) => prev + 1);
  }, []);

  const endSession = useCallback((finalSession) => {
    setCurrentSession(finalSession);
  }, []);

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
    setRoundNumber(0);
  }, []);

  return (
    <NegotiationContext.Provider
      value={{
        currentSession,
        messages,
        roundNumber,
        loading,
        setLoading,
        startSession,
        addMessage,
        incrementRound,
        endSession,
        resetSession,
      }}
    >
      {children}
    </NegotiationContext.Provider>
  );
};

export const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (!context) {
    throw new Error('useNegotiation must be used within a NegotiationProvider');
  }
  return context;
};
