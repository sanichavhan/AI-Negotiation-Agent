import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardApi } from '../api/endpoints';

const LeaderboardPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecentPurchases = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      // Use the getLeaderboard endpoint but with sortBy createdAt (most recent first)
      const response = await leaderboardApi.getRecentPurchases(pageNum, 50);
      if (response.data.success) {
        setPurchases(response.data.data.purchases || []);
        setTotalPages(response.data.data.pages);
        setPage(pageNum);
      } else {
        setError(response.data.message || 'Failed to load recent purchases');
      }
    } catch (err) {
      console.error('Error fetching recent purchases:', err);
      // Fallback: try to get leaderboard data and reverse it
      try {
        const response = await leaderboardApi.getLeaderboard(1, 50, 'totalSavings');
        if (response.data.success) {
          const allEntries = response.data.data.leaderboard || [];
          setPurchases(allEntries.reverse());
          setTotalPages(1);
        }
      } catch (fallbackErr) {
        setError('Failed to load recent purchases');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPurchases(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchRecentPurchases(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">🛍️ Recent Purchases</h1>
              <p className="text-blue-100 mt-2">Latest Negotiated Deals on Our Platform</p>
            </div>
            <Link
              to="/profile"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Recent Purchases Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Product</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Original Price</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Final Price</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Discount</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Discount %</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Rounds</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3">Loading recent purchases...</span>
                    </div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No purchases recorded yet
                  </td>
                </tr>
              ) : (
                purchases.map((purchase, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition hover:bg-indigo-50 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {purchase.username || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {purchase.productName || 'Unknown Product'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700 font-semibold">
                      ${purchase.initialPrice || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-right text-blue-600 font-bold">
                      ${purchase.finalPrice || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold">
                      💰 ${purchase.discount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {purchase.discountPercentage?.toFixed(1) || '0'}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                      {purchase.roundsUsed || '0'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 text-sm">
                      {formatDate(purchase.completedAt || purchase.lastDeal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded ${
                      page === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
