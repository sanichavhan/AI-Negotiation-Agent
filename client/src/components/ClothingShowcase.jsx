import React, { useEffect } from 'react';
import ProductGrid from './ProductGrid';
import useProducts from '../hooks/useProductsHook';
import { GlassCard, Button } from './ui';

/**
 * ClothingShowcase — Redesigned for Astral Architect
 */
const ClothingShowcase = ({ onProductSelect }) => {
  const {
    products,
    loading,
    error,
    fetchClothingProducts,
    clearProducts,
  } = useProducts();

  // Fetch products on mount
  useEffect(() => {
    fetchClothingProducts(6);
    return () => {
      clearProducts();
    };
  }, []);

  const handleProductSelect = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleRefresh = () => {
    fetchClothingProducts(6);
  };

  return (
    <div className="w-full">
      {/* ── Action Header (Refresh) ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 animate-fade-in">
        <div>
          <h2 className="text-display-xs font-bold mb-1">Available Resources</h2>
          <p className="text-on-surface-variant text-sm">Real-time inventory from the central vault.</p>
        </div>
        
        <Button
          onClick={handleRefresh}
          loading={loading}
          variant="secondary"
          size="md"
          iconLeft={<span>🔄</span>}
        >
          Refresh Inventory
        </Button>
      </div>

      {/* ── Products Grid ────────────────────────────────────── */}
      <ProductGrid
        products={products}
        onProductSelect={handleProductSelect}
        isLoading={loading}
        error={error}
        columns={3}
        showEmpty={true}
      />

      {/* ── Protocol Info Panel ───────────────────────────────── */}
      {!loading && products.length > 0 && (
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <GlassCard tier="low" className="border-l-4 border-l-primary/50">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                💡
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-3 flex items-center gap-3">
                  Negotiation Protocol
                  <span className="text-[10px] font-label font-bold text-primary px-2 py-0.5 rounded bg-primary/10 uppercase tracking-widest">Guide</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    'Select a high-value object to initiate a session.',
                    'Communicate with the AI custodian via the terminal.',
                    'Custodian offers vary based on sentiment and logic.',
                    'Finalize contracts when target margin is reached.',
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ClothingShowcase;

