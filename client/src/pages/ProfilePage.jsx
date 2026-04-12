import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuthHook';
import { leaderboardApi } from '../api/endpoints';
import { GlassCard, Button, LoadingSpinner } from '../components/ui';

/**
 * ProfilePage — User Identity & Analytics Deck
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { getProfile, loading, error } = useAuthHook();

  const [profileData, setProfileData] = useState(user);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        updateUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (!profileData) fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const response = await leaderboardApi.getUserStats();
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } catch (err) {
        console.error(err);
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

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-12 px-4 max-w-5xl mx-auto">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none -z-10" />
      <div className="fixed top-20 left-1/4 w-96 h-96 orb-violet opacity-10 pointer-events-none -z-10" />

      {/* ── Identity Header ───────────────────────────────────── */}
      <header className="mb-12 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-astral-gradient flex items-center justify-center text-5xl shadow-bloom-violet border border-white/20">
            {profileData?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-success px-2 py-1 rounded-md text-[8px] font-bold text-black uppercase tracking-widest border border-black/20">
            Online
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="mb-2">
            <span className="badge badge-cyan mb-2">OPERATOR STATUS</span>
            <h1 className="text-display-sm font-bold">{profileData?.displayName || profileData?.username}</h1>
          </div>
          <p className="text-on-surface-variant font-medium tracking-tight opacity-60">
            {profileData?.email}
          </p>
        </div>
        <div className="md:ml-auto flex gap-4">
          <Button variant="ghost" size="md">Settings</Button>
          <Button variant="danger" size="md" onClick={handleLogout}>Disconnect</Button>
        </div>
      </header>

      {/* ── Analytical Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        {[
          { label: 'Best Deal', val: profileData?.bestDeal ? `$${profileData.bestDeal}` : 'N/A', glow: 'violet', icon: '💎' },
          { label: 'Avg Discount', val: `${profileData?.averageDiscount?.toFixed(1) || '0.0'}%`, glow: 'cyan', icon: '📉' },
          { label: 'Total Savings', val: userStats?.stats?.totalSavings ? `$${userStats.stats.totalSavings}` : '$0.00', glow: 'none', icon: '💰' },
          { label: 'Negotiations', val: userStats?.stats?.totalNegotiations || '0', glow: 'none', icon: '🤝' },
        ].map((stat, i) => (
          <GlassCard key={i} tier="low" glow={stat.glow} padding="p-6">
            <div className="text-2xl mb-4">{stat.icon}</div>
            <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold font-headline">{stat.val}</p>
          </GlassCard>
        ))}
      </div>

      {/* ── Achievements Row ──────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {[
          { icon: '🏆', label: 'Pro Negotiator', unlocked: true },
          { icon: '🎯', label: 'Close Target', unlocked: true },
          { icon: '💰', label: 'Vault Raider', unlocked: profileData?.bestDeal > 0 },
          { icon: '⚡', label: 'Quick Solver', unlocked: false },
          { icon: '🛡️', label: 'Logic Shield', unlocked: false },
          { icon: '🔥', label: 'Hot Streak', unlocked: false },
        ].map((badge, i) => (
          <GlassCard 
            key={badge.label} 
            padding="p-3" 
            className={`flex flex-col items-center justify-center text-center transition-all ${badge.unlocked ? 'opacity-100 grayscale-0' : 'opacity-30 grayscale'}`}
          >
            <div className="text-xl mb-1">{badge.icon}</div>
            <span className="text-[8px] font-label font-bold uppercase tracking-tighter text-on-surface-variant line-clamp-1">{badge.label}</span>
          </GlassCard>
        ))}
      </div>

      {/* ── Detailed Metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <GlassCard className="lg:col-span-2" padding="p-8">
          <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
            Market Efficiency
            <span className="h-px flex-grow bg-outline-variant/20" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Success Rate</p>
                <div className="h-2 w-full bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[85%] shadow-glow-success" />
                </div>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-sm text-on-surface-variant">Avg Rounds per session</span>
                <span className="text-xl font-bold text-primary">{userStats?.stats?.averageRounds || '0.0'}</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-sm text-on-surface-variant">Total Volume Moved</span>
                <span className="text-xl font-bold text-cyan-400">${userStats?.stats?.totalSpent || '0.00'}</span>
              </div>
            </div>
            <div className="bg-surface-high/20 rounded-2xl p-6 border border-outline-variant/10">
              <div className="text-3xl mb-4">🎖️</div>
              <p className="text-sm text-on-surface font-medium mb-1">Vault Clearance Level</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You have authorized access to premium inventory tiers. Continue negotiating to reach "Golden Negotiator" status.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="p-8" glow="violet">
          <h3 className="text-xl font-headline font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {statsLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-10 italic opacity-40">
                Log synchronized with blockchain. No new events.
              </p>
            )}
          </div>
          <Button variant="secondary" fullWidth className="mt-6">Download Ledger</Button>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;

