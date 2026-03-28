import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuthHook';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { getProfile, loading, error } = useAuthHook();

  const [profileData, setProfileData] = useState(user);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        {profileData && (
          <div className="grid grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="col-span-2 bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {profileData.displayName || profileData.username}
                </h2>
                <p className="text-gray-600">@{profileData.username}</p>
                <p className="text-gray-600">{profileData.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border-t pt-4">
                  <p className="text-gray-600">Total Negotiations</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {profileData.totalNegotiations}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600">Best Deal</p>
                  <p className="text-3xl font-bold text-green-600">
                    {profileData.bestDeal ? `$${profileData.bestDeal}` : 'N/A'}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600">Average Discount</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {profileData.averageDiscount?.toFixed(2)}%
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-600">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <p className="text-gray-600 text-sm mb-2">Player Rank</p>
              <p className="text-4xl font-bold text-yellow-600 mb-6">#1</p>

              <p className="text-gray-600 text-sm mb-2">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">95%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
