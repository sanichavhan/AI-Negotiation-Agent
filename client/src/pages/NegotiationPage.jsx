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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down (and past 50px threshold)
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        navigate('/products', {
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
      <header className={`bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
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
      <main className="max-w-4xl mx-auto px-4 py-8 pt-20">
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
      <footer className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Negotiation Tips */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span> Negotiation Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Start with 50-60% of original price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Increase gradually (5-10% per round)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Be respectful and logical</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Use justifications for offers</span>
                </li>
              </ul>
            </div>

            {/* AI Shopkeeper Rules */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI Shopkeeper Rules
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Will never reveal minimum price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Uses strategic persuasion tactics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Accepts fair offers gracefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Provides realistic counter-offers</span>
                </li>
              </ul>
            </div>

            {/* Success Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Your Goal
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Get the best price while maintaining a win-win situation with the shopkeeper.
                </p>
                <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-xs font-semibold text-blue-900">💰 Pro Tip:</p>
                  <p className="text-xs text-blue-800 mt-1">
                    The more you save, the higher your leaderboard ranking!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-xl">❓</span>
              <span><strong>Need help?</strong> Check our negotiation guides and best practices.</span>
            </div>
            <a 
              href="/leaderboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
            >
              View Leaderboard →
            </a>
          </div>

          {/* Footer Copyright */}
          <div className="text-center text-gray-500 text-xs mt-6 border-t border-gray-200 pt-6">
            <p>&copy; 2026 AI Negotiation Agent | Master negotiation skills one deal at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NegotiationPage;
