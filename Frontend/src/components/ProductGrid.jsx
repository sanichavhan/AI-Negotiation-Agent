import React from 'react';
import ProductCard from './ProductCard';
import { GlassCard, LoadingSpinner } from './ui';

/**
 * ProductGrid — Redesigned for Astral Architect
 */
const ProductGrid = ({
  products = [],
  onProductSelect,
  isLoading = false,
  error = null,
  columns = 3,
  showEmpty = true,
  title = '',
}) => {
  // ── Loading State ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center animate-fade-in">
        <LoadingSpinner size="lg" />
        <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mt-8 animate-pulse">
          Initializing Marketplace...
        </p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full py-12 px-4 animate-fade-in">
        <GlassCard tier="elevated" glow="violet" className="max-w-xl mx-auto text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-headline font-bold text-danger mb-2">Market Data Corrupted</h3>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-secondary font-bold hover:underline underline-offset-4"
          >
            Reconnect to Server
          </button>
        </GlassCard>
      </div>
    );
  }

  // ── Empty State ────────────────────────────────────────────
  if (products.length === 0 && showEmpty) {
    return (
      <div className="w-full py-12 px-4 animate-fade-in">
        <GlassCard tier="low" className="max-w-xl mx-auto text-center py-16">
          <div className="text-5xl mb-6 opacity-40">📦</div>
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Vault is Empty</h3>
          <p className="text-on-surface-variant text-sm">
            All current stock has been reserved. Please wait for the next inventory refresh.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Title Section ────────────────────────────────────── */}
      {title && (
        <div className="mb-10 animate-fade-in">
          <h2 className="text-display-sm font-bold tracking-tight mb-2">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-px flex-grow bg-outline-variant/20" />
            <p className="text-[10px] font-label font-bold text-secondary uppercase tracking-[0.3em] whitespace-nowrap">
              {products.length} {products.length === 1 ? 'OBJECT' : 'OBJECTS'} DETECTED
            </p>
            <div className="h-px w-12 bg-outline-variant/20" />
          </div>
        </div>
      )}

      {/* ── Grid Container ───────────────────────────────────── */}
      <div
        className={`
          grid gap-6 sm:gap-8
          ${columns === 1 ? 'grid-cols-1' : ''}
          ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
          ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
          ${columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''}
          ${columns === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : ''}
        `}
      >
        {products.map((product, idx) => (
          <div 
            key={product.id} 
            className="flex w-full h-full items-stretch animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <ProductCard
              product={product}
              onSelect={onProductSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

