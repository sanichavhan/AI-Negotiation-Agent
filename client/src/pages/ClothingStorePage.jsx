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
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Subscription Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
                <p className="text-blue-100">Get tips on improving your negotiation skills and exclusive deals</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="bg-white hover:bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🏪 AI Negotiations
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Master the art of negotiation with our AI-powered shopping experience. Real products, real skills.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">𝕏</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">f</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">in</a>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
              <ul className="space-y-3 text-sm">
                <li className="text-gray-400 hover:text-blue-400 transition cursor-pointer">✨ AI Negotiation</li>
                <li className="text-gray-400 hover:text-blue-400 transition cursor-pointer">📊 Leaderboard</li>
                <li className="text-gray-400 hover:text-blue-400 transition cursor-pointer">🏆 Rankings</li>
                <li className="text-gray-400 hover:text-blue-400 transition cursor-pointer">📈 Analytics</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/profile" className="text-gray-400 hover:text-blue-400 transition">Your Profile</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-blue-400 transition">Leaderboard</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Help Center</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-sm">
                <li className="text-gray-400">📧 <a href="mailto:support@ainegotiation.com" className="hover:text-blue-400 transition">support@ainegotiation.com</a></li>
                <li className="text-gray-400">💬 Live Chat Available</li>
                <li className="text-gray-400">⏰ 24/7 Support</li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-12 py-8 border-y border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">50K+</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">100K+</p>
              <p className="text-gray-400 text-sm">Negotiations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">$5M+</p>
              <p className="text-gray-400 text-sm">Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">98%</p>
              <p className="text-gray-400 text-sm">Satisfaction</p>
            </div>
            <div className="text-center hidden md:block">
              <p className="text-2xl font-bold text-blue-400">24/7</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
          </div>

          {/* Legal and Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>About AI Negotiation Store:</strong> We help you master negotiation skills through interactive AI-powered experiences. Buy smarter, negotiate better.
              </p>
              <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Sitemap</a>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
              <p>&copy; 2026 AI Negotiation Agent. All rights reserved. | Built with ❤️ by Copilot</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClothingStorePage;
