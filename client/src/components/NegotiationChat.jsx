import React, { useState, useEffect, useRef } from 'react';
import { useNegotiation } from '../context/NegotiationContext';
import { negotiationApi } from '../api/endpoints';

/**
 * NegotiationChat Component
 * Displays chat messages between user and AI shopkeeper
 * Handles price negotiation and deal acceptance
 */
const NegotiationChat = ({ product, sessionId, onDealAccepted, onDealRejected }) => {
  const { messages, addMessage, incrementRound, setLoading } = useNegotiation();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dealStatus, setDealStatus] = useState(null); // 'accepted', 'rejected', null
  const [currentPrice, setCurrentPrice] = useState(product?.price || 0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const messageText = userInput;
    
    // Add user message to chat immediately
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setUserInput('');
    setIsLoading(true);
    setLoading(true);

    try {
      console.log('📤 Sending message to backend...', {
        sessionId,
        messageLength: messageText.length,
      });
      
      // Send message to backend
      const response = await negotiationApi.sendMessage(sessionId, {
        message: messageText,
      });

      console.log('✅ Response received:', response.data);

      if (response.data.success) {
        const apiData = response.data.data;
        
        // Get AI message - try multiple possible field names
        const aiResponseText = apiData.message || apiData.aiResponse || apiData.aiMessage || 'No response';
        
        // Track the current negotiated price
        if (apiData.newPrice || apiData.counterPrice) {
          setCurrentPrice(apiData.newPrice || apiData.counterPrice);
        }
        
        // Add AI message to chat
        const aiMessage = {
          role: 'ai',
          content: aiResponseText,
          timestamp: new Date(),
        };
        addMessage(aiMessage);
        incrementRound();

        // No automatic deal completion - user must click "Accept Deal" button
        // This allows continuous negotiation without time limits
      } else {
        throw new Error(response.data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.error?.message,
        url: error.config?.url,
      });
      
      // Determine the actual error message
      let errorMsg = 'Failed to send message';
      
      if (error.response?.status === 401) {
        errorMsg = '❌ Authentication failed. Please log in again.';
      } else if (error.response?.status === 404) {
        errorMsg = '❌ Session not found. Please start a new negotiation.';
      } else if (error.response?.status === 500) {
        errorMsg = '❌ Server error. Please try again.';
      } else if (error.response?.data?.error?.message) {
        errorMsg = `❌ ${error.response.data.error.message}`;
      } else if (error.response?.data?.message) {
        errorMsg = `❌ ${error.response.data.message}`;
      } else if (error.message) {
        errorMsg = `❌ ${error.message}`;
      }
      
      addMessage({
        role: 'system',
        content: errorMsg,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAcceptDeal = async () => {
    try {
      const response = await negotiationApi.acceptDeal(sessionId);
      
      if (response.data.success) {
        setDealStatus('accepted');
        addMessage({
          role: 'system',
          content: `✅ Deal accepted! Shopkeeper agreed to ${product.title} at $${currentPrice}. Moving to checkout...`,
          timestamp: new Date(),
        });
        
        // Call the parent callback after a short delay
        setTimeout(() => {
          if (onDealAccepted) {
            onDealAccepted({
              finalPrice: currentPrice,
              sessionId,
            });
          }
        }, 1500);
      } else {
        addMessage({
          role: 'system',
          content: '❌ Failed to accept deal. Please try again.',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error accepting deal:', error);
      const errorMsg = error.response?.data?.message || 'Failed to accept deal';
      addMessage({
        role: 'system',
        content: `❌ Error: ${errorMsg}`,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Product Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-bold">{product.title}</h2>
        <p className="text-sm opacity-90">Original Price: ${product.price}</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">👋 Let's negotiate!</p>
              <p className="text-gray-400 text-sm">
                Make an offer for {product.title}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : msg.role === 'system'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>
                  {msg.content}
                </p>
                <p
                  className={`text-xs ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  } mt-1`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Deal Status Messages */}
        {dealStatus === 'accepted' && (
          <div className="flex justify-center my-4">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-700 font-bold text-lg">🎉 Deal Accepted!</p>
              <p className="text-green-600">The shopkeeper accepted your price!</p>
            </div>
          </div>
        )}

        {dealStatus === 'rejected' && (
          <div className="flex justify-center my-4">
            <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 text-center">
              <p className="text-yellow-700 font-bold text-lg">❌ Deal Rejected</p>
              <p className="text-yellow-600">The price is too low. Try again!</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Information Box */}
      {dealStatus !== 'accepted' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mx-4 mt-2 rounded">
          <p className="text-sm text-blue-800">
            💰 <strong>Current Price:</strong> ${currentPrice || product.price}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            You can negotiate for as long as you want. Click "Accept Deal" when you're happy with the price!
          </p>
        </div>
      )}

      {/* Input Area */}
      {dealStatus !== 'accepted' && (
        <div className="border-t p-4 bg-gray-50">
          <form onSubmit={handleSendMessage} className="flex gap-2 mb-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Make an offer... (e.g., How about $50?)"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Sending...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </form>
          
          {/* Accept Deal Button */}
          <button
            onClick={handleAcceptDeal}
            disabled={isLoading || messages.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            ✅ Accept This Deal
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific with your offer (e.g., "$50", "Will you take $45?")
          </p>
        </div>
      )}

      {/* Deal Accepted Action Buttons */}
      {dealStatus === 'accepted' && (
        <div className="border-t p-4 bg-green-50 flex gap-3">
          <button
            onClick={() => onDealAccepted?.()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ✅ Complete Purchase
          </button>
          <button
            onClick={() => window.location.href = '/products'}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Browse More
          </button>
        </div>
      )}
    </div>
  );
};

export default NegotiationChat;
