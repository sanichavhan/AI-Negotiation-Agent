import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import ClothingShowcase from '../components/ClothingShowcase';

/**
 * Clothing Store Showcase Page — Redesigned with Astral Architect aesthetics
 */
const ClothingStorePage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details on page load (keep logic for potential context usage)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await authApi.getMe();
        if (response.data.success) {
          setUserDetails(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleProductSelect = (product) => {
    navigate('/negotiation', { state: { product } });
  };

  return (
    <div className="relative min-h-screen">
      {/* ── Background Effects ─────────────────────────────────── */}
      <div className="fixed inset-0 bg-grid opacity-15 pointer-events-none -z-10" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] orb-violet opacity-20 pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] orb-cyan opacity-10 pointer-events-none -z-10" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <header className="section-container pt-16 pb-12 animate-fade-in">
        <div className="max-w-3xl">
          <div className="badge badge-violet mb-4">
            ✨ Premium Collection
          </div>
          <h1 className="text-display-md font-bold mb-4 tracking-tight">
            The <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Browse our curated collection of high-demand items. Select any product to 
            enter a negotiation terminal and secure your preferred rate.
          </p>
        </div>
      </header>

      {/* ── Main Showcase ─────────────────────────────────────── */}
      <main className="section-container pb-24">
        <ClothingShowcase onProductSelect={handleProductSelect} />
      </main>
    </div>
  );
};

export default ClothingStorePage;

