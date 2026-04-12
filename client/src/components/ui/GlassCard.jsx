import React from 'react';

/**
 * GlassCard — Reusable Astral Architect glassmorphism card
 *
 * Props:
 *   tier     : 'default' | 'high' | 'floating'  — glass depth/opacity level
 *   glow     : 'none' | 'violet' | 'cyan'        — ambient glow color
 *   hover    : bool — enable lift effect on hover
 *   padding  : string — Tailwind padding class (default: 'p-6')
 *   rounded  : string — Tailwind rounded class  (default: 'rounded-xl')
 *   className: string — extra Tailwind classes
 *   as       : element type ('div' | 'article' | 'section' etc.)
 */
const GlassCard = ({
  children,
  tier     = 'default',
  glow     = 'none',
  hover    = false,
  padding  = 'p-6',
  rounded  = 'rounded-xl',
  className = '',
  as: Tag   = 'div',
  style     = {},
  ...rest
}) => {
  // ── Base glass class by tier ─────────────────────────────────
  const tierClass = {
    default:  'glass-card',
    high:     'glass-card-high',
    floating: 'glass-card-floating',
  }[tier] ?? 'glass-card';

  // ── Glow modifier ────────────────────────────────────────────
  const glowStyle = {
    violet: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35), 0 0 60px rgba(124,58,237,0.12)' },
    cyan:   { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35), 0 0 60px rgba(6,182,212,0.1)' },
    none:   {},
  }[glow] ?? {};

  // ── Hover transition classes ─────────────────────────────────
  const hoverClass = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer'
    : '';

  return (
    <Tag
      className={`${tierClass} ${padding} ${rounded} ${hoverClass} ${className}`}
      style={{ ...glowStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
