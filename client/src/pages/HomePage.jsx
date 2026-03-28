import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">AI Negotiation Game</h1>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.username}</span>
                  <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">
                    Profile
                  </Link>
                  <Link to="/leaderboard" className="text-indigo-600 hover:text-indigo-800">
                    Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                    Login
                  </Link>
                  <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Negotiate Like a Pro
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Challenge our AI negotiator and win the best deals. Compete on the leaderboard!
          </p>

          {isAuthenticated ? (
            <Link
              to="/leaderboard"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Start Negotiating
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">🤖 Smart AI</h3>
            <p className="text-gray-600">
              Negotiate with an intelligent AI seller using advanced negotiation tactics
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">🏆 Leaderboards</h3>
            <p className="text-gray-600">
              Compete with other players and climb the rankings
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">💰 Real Negotiation</h3>
            <p className="text-gray-600">
              Learn negotiation skills by playing strategically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
