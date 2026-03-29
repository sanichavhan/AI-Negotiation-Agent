/**
 * Clothing Store Showcase Page
 * Demo page showing the clothing products with card components
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/endpoints';
import ClothingShowcase from '../components/ClothingShowcase';

const ClothingStorePage = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down (and past 100px threshold)
        setIsNavbarVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch user details on page load
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await authApi.getMe();
        
        if (response.data.success) {
          setUserDetails(response.data.data);
          console.log('📋 User details fetched:', response.data.data);
        } else {
          setError('Failed to fetch user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.response?.data?.message || 'Error loading user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleProductSelect = (product) => {
    console.log('Selected product:', product);
    // Navigate to negotiation page with selected product as state
    navigate('/negotiation', { 
      state: { product } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isNavbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              🏪 AI Negotiation Store
            </Link>
            
            {/* User Info Section */}
            <div className="flex items-center gap-6">
              {userDetails && (
                <div className="flex items-center gap-4">
                  {/* User Details Display */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {userDetails.displayName || userDetails.username}
                    </p>
                    <p className="text-xs text-gray-500">{userDetails.email}</p>
                    {userDetails.totalNegotiations !== undefined && (
                      <p className="text-xs text-blue-600 font-medium">
                        📊 {userDetails.totalNegotiations} negotiations
                      </p>
                    )}
                  </div>
                  
                  {/* Avatar */}
                  {userDetails.avatar ? (
                    <img 
                      src={userDetails.avatar} 
                      alt={userDetails.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {(userDetails.displayName || userDetails.username || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              {/* Profile and Leaderboard Links */}
              <div className="flex gap-2">
                <Link 
                  to="/profile"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
                >
                  Profile
                </Link>
                <Link 
                  to="/leaderboard"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 pt-24">
        <ClothingShowcase onProductSelect={handleProductSelect} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-400">
                AI Negotiation Store - Practice your negotiation skills with our AI seller
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>✓ Real product data from FakeStore API</li>
                <li>✓ AI-powered negotiation</li>
                <li>✓ Track your purchases</li>
                <li>✓ Leaderboard rankings</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">support@ainegotiation.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AI Negotiation Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClothingStorePage;
