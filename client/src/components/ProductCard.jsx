import React from 'react';
import { GlassCard, Button } from './ui';

/**
 * ProductCard — Redesigned with Astral Architect glassmorphism
 */
const ProductCard = ({
  product,
  onSelect,
  onClick,
  showRating = true,
}) => {
  if (!product) return null;

  const { title, price, image, category, rating = {} } = product;
  const displayTitle = title.length > 55 ? `${title.substring(0, 52)}...` : title;

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(product);
  };

  const handleClick = () => {
    if (onClick) onClick(product);
  };

  return (
    <GlassCard
      hover
      padding="p-0"
      className="flex flex-col h-full animate-fade-in group"
      onClick={handleClick}
    >
      {/* ── Product Image Container ──────────────────────────── */}
      <div className="relative h-56 overflow-hidden rounded-t-xl bg-surface-dim flex items-center justify-center p-6 scan-line">
        {/* Subtle background glow for image */}
        <div className="absolute inset-0 bg-violet-orb opacity-10 group-hover:opacity-20 transition-opacity" />
        
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain mix-blend-lighten group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="badge badge-violet backdrop-blur-md opacity-90">
            {category}
          </span>
        </div>
      </div>

      {/* ── Product Info ────────────────────────────────────── */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-title-lg text-on-surface mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(rating.rate || 0) ? 'fill-current' : 'text-on-surface-variant/30'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant/60 uppercase tracking-widest leading-none mt-0.5">
              {rating.count || 0} REVIEWS
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-headline-sm font-bold text-gradient-cyan">
              ${price.toFixed(2)}
            </span>
            <span className="text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-wider">
              List Price
            </span>
          </div>
          
          {/* Negotiation Opportunity */}
          <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/5 border border-secondary/10 w-fit">
            <span className="text-secondary text-xs">⚡</span>
            <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
              Available for Negotiation
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          fullWidth
          className="mt-auto group/btn"
          onClick={handleSelect}
          iconRight={<span className="group-hover/btn:translate-x-1 transition-transform">→</span>}
        >
          Start Negotiation
        </Button>
      </div>
    </GlassCard>
  );
};

export default ProductCard;

