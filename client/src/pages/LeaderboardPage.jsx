import React, { useState, useEffect } from 'react';
import { leaderboardApi } from '../api/endpoints';
import { GlassCard, LoadingSpinner, Button } from '../components/ui';

/**
 * LeaderboardPage — The Global Negotiation Index
 */
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
      const response = await leaderboardApi.getRecentPurchases(pageNum, 50);
      if (response.data.success) {
        setPurchases(response.data.data.purchases || []);
        setTotalPages(response.data.data.pages);
        setPage(pageNum);
      } else {
        setError(response.data.message || 'Failed to sync marketplace data.');
      }
    } catch (err) {
      setError('Connection to indexing service lost.');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-display-md font-bold mb-3">Recent Transactions</h1>
        <p className="text-on-surface-variant max-w-2xl">
          Global negotiation broadcast. Monitor live contract finalization and bargaining efficiency across the network.
        </p>
      </div>

      {/* ── Data Grid ──────────────────────────────────────────── */}
      <GlassCard tier="low" padding="p-0" className="overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-high/60 border-b border-outline-variant/30">
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em]">Operator</th>
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em]">Asset</th>
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em] text-right">Standard Rate</th>
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em] text-right">Settlement</th>
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em] text-center">Bargain</th>
                <th className="px-6 py-5 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-on-surface-variant font-label text-xs uppercase tracking-widest opacity-40">
                    No active sessions detected
                  </td>
                </tr>
              ) : (
                purchases.map((purchase, idx) => {
                  const isTop3 = page === 1 && idx < 3;
                  const rankClass = isTop3 
                    ? idx === 0 ? 'border-l-4 border-amber-400 shadow-[inset_4px_0_12px_rgba(251,191,36,0.1)]'
                    : idx === 1 ? 'border-l-4 border-slate-300 shadow-[inset_4px_0_12px_rgba(203,213,225,0.1)]'
                    : 'border-l-4 border-orange-600 shadow-[inset_4px_0_12px_rgba(234,88,12,0.1)]'
                    : '';
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`group hover:bg-surface-high/40 transition-colors duration-300 animate-fade-in-up ${rankClass}`}
                      style={{ animationDelay: `${Math.min(idx * 50, 600)}ms` }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-outline-variant/20 ${
                            isTop3 ? 'bg-primary text-background' : 'bg-surface-high text-primary'
                          }`}>
                            {isTop3 ? ['🥇', '🥈', '🥉'][idx] : purchase.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                        <span className="font-bold text-on-surface text-sm">
                          {purchase.username || 'ANON_USER'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-sm text-on-surface-variant">
                      {purchase.productName}
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-xs text-on-surface-variant/60 line-through">
                      ${purchase.initialPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-sm text-on-surface">
                      ${purchase.finalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider border border-success/20 shadow-glow-success/10">
                        {purchase.discountPercentage?.toFixed(1)}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-label text-[10px] text-on-surface-variant/40">
                      {formatDate(purchase.completedAt || purchase.lastDeal)}
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Pagination ─────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
          >
            PREV
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 rounded-lg font-label text-xs font-bold transition-all duration-300 ${
                  page === i + 1 
                    ? 'bg-primary text-white shadow-bloom-violet' 
                    : 'bg-surface-high/40 text-on-surface-variant hover:bg-surface-high hover:text-on-surface'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;

