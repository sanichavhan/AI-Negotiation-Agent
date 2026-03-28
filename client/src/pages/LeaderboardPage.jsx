import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLeaderboard as useLeaderboardHook } from '../hooks/useLeaderboardHook';
import { utilService } from '../services/appServices';

const LeaderboardPage = () => {
  const { getLeaderboard, loading, error } = useLeaderboardHook();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(1, 50);
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
            <Link
              to="/profile"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Player</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Final Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No completed negotiations yet'}
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-indigo-600">#{idx + 1}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {entry.username}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{entry.productName}</td>
                    <td className="px-6 py-4 font-semibold">
                      {utilService.formatPrice(entry.finalPrice)}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {utilService.formatPrice(entry.discount)} ({entry.discountPercentage}%)
                    </td>
                    <td className="px-6 py-4 text-lg font-bold text-gray-900">
                      {utilService.formatPrice(entry.score)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
