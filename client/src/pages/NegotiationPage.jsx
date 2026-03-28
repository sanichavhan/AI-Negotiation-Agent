import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNegotiation } from '../context/NegotiationContext';
import { negotiationApi } from '../api/endpoints';
import NegotiationChat from '../components/NegotiationChat';

/**
 * NegotiationPage
 * Displays the negotiation chat interface for a selected product
 * User negotiates price with AI shopkeeper
 */
const NegotiationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentSession, startSession, resetSession } = useNegotiation();
  
  const [product, setProduct] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Get product from navigation state
  useEffect(() => {
    const selectedProduct = location.state?.product;
    const token = localStorage.getItem('token');
    
    console.log('🔐 NegotiationPage initialized:', {
      hasProduct: !!selectedProduct,
      hasToken: !!token,
      tokenLength: token?.length,
      user: user?.email,
    });
    
    if (!selectedProduct) {
      setError('No product selected. Redirecting...');
      setTimeout(() => navigate('/products'), 2000);
      return;
    }

    setProduct(selectedProduct);
    initializeNegotiationSession(selectedProduct);
  }, [location]);

  /**
   * Initialize a new negotiation session with the backend
   */
  const initializeNegotiationSession = async (selectedProduct) => {
    try {
      setIsInitializing(true);
      setError(null);

      // Start a new negotiation session with the AI
      const response = await negotiationApi.startSession({
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        originalPrice: selectedProduct.price,
        userInitialPrice: selectedProduct.price,
      });

      if (response.data.success) {
        const session = response.data.data;
        setSessionId(session._id || session.id);
        startSession(session);
      } else {
        setError(response.data.message || 'Failed to start negotiation');
      }
    } catch (err) {
      console.error('Error starting negotiation:', err);
      setError(
        err.response?.data?.message ||
          'Failed to initialize negotiation. Please try again.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDealAccepted = async (dealData) => {
    try {
      const response = await negotiationApi.acceptDeal(sessionId);
      if (response.data.success) {
        navigate('/profile', {
          state: { 
            dealCompleted: true,
            product: product,
            finalPrice: dealData.finalPrice,
          },
        });
      }
    } catch (err) {
      console.error('Error completing purchase:', err);
      setError('Failed to complete the purchase. Please try again.');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-lg font-semibold text-gray-700">
            Starting negotiation...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Connecting to shopkeeper...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-lg font-semibold text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Loading negotiation...
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="text-2xl hover:scale-110 transition"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Negotiation Chat
              </h1>
              <p className="text-sm text-gray-500">
                Chatting with shopkeeper about {product.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg border-2 border-blue-500"
            />
            <div>
              <p className="font-semibold text-gray-700">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Original Price</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-[600px]">
          <NegotiationChat
            product={product}
            sessionId={sessionId}
            onDealAccepted={handleDealAccepted}
            onDealRejected={() => {}}
          />
        </div>
      </main>

      {/* Info Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">💡 Negotiation Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Start with 50-60% of original price</li>
                <li>• Increase gradually (5-10% each round)</li>
                <li>• Be respectful and polite</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">🎯 AI Shopkeeper Rules</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Needs 20-30% profit minimum</li>
                <li>• Will accept fair offers</li>
                <li>• Provides realistic feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">✅ Goal</h4>
              <p className="text-sm text-gray-600">
                Negotiate the best possible price while keeping the shopkeeper's profit margin!
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NegotiationPage;
