import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuthHook';
import { leaderboardApi } from '../api/endpoints';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { getProfile, loading, error } = useAuthHook();

  const [profileData, setProfileData] = useState(user);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        updateUser(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (!profileData) {
      fetchProfile();
    }
  }, []);

  // Fetch user stats and ranking
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await leaderboardApi.getUserStats();
        if (response.data.success) {
          setUserStats(response.data.data);
          console.log('User Stats:', response.data.data);
        } else {
          setStatsError('Failed to load stats');
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setStatsError('Could not load ranking');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const calculateSuccessRate = () => {
    if (!userStats || !userStats.stats) return 0;
    // Success rate based on negotiations completed
    const { totalNegotiations } = userStats.stats;
    return totalNegotiations > 0 ? Math.round((totalNegotiations / Math.max(totalNegotiations, 1)) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {profileData && (
          <div className="grid grid-cols-1 gap-8">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profileData.displayName || profileData.username}
                </h2>
                <p className="text-gray-400 text-lg">@{profileData.username}</p>
                <p className="text-gray-400">{profileData.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm font-semibold mb-2">Best Deal</p>
                  <p className="text-4xl font-bold text-green-400">
                    {profileData.bestDeal ? `$${profileData.bestDeal}` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm font-semibold mb-2">Average Discount</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {profileData.averageDiscount?.toFixed(2) || '0.00'}%
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm font-semibold mb-2">Member Since</p>
                  <p className="text-lg font-semibold text-gray-100">
                    {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Additional Stats from Leaderboard */}
              {userStats && userStats.stats && (
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Detailed Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-1">Total Savings</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${userStats.stats.totalSavings || '0.00'}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-blue-400">
                        ${userStats.stats.totalSpent || '0.00'}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-1">Average Order Value</p>
                      <p className="text-2xl font-bold text-purple-400">
                        ${userStats.stats.averageOrderValue || '0.00'}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-1">Average Rounds</p>
                      <p className="text-2xl font-bold text-indigo-400">
                        {userStats.stats.averageRounds || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition">
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {!profileData && !loading && (
          <div className="text-center text-gray-400">
            <p>Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
