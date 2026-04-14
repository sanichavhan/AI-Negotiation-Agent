import React from 'react';

/**
 * LoadingSpinner — Astral Architect loading states
 *
 * Props:
 *   fullScreen : bool — takes over the whole viewport
 *   size       : 'sm' | 'md' | 'lg'
 *   message    : string — optional text beneath spinner
 *   sub        : string — optional small sub-text
 *   color      : 'violet' | 'cyan'
 */
const LoadingSpinner = ({
  fullScreen = false,
  size       = 'md',
  message    = '',
  sub        = '',
  color      = 'violet',
}) => {
  // ── Spinner size ─────────────────────────────────────────────
  const dims = { sm: 24, md: 48, lg: 72 }[size] ?? 48;
  const border = { sm: 2, md: 3, lg: 4 }[size] ?? 3;
  const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];

  const spinnerColor = color === 'cyan' ? '#4cd7f6' : '#7c3aed';
  const trackColor   = color === 'cyan'
    ? 'rgba(6,182,212,0.15)'
    : 'rgba(124,58,237,0.15)';
  const glowColor    = color === 'cyan'
    ? 'rgba(6,182,212,0.4)'
    : 'rgba(124,58,237,0.4)';

  const Spinner = () => (
    <div
      style={{
        width:  dims,
        height: dims,
        borderRadius: '50%',
        border: `${border}px solid ${trackColor}`,
        borderTopColor: spinnerColor,
        boxShadow: `0 0 ${dims / 2}px ${glowColor}`,
        animation: 'spin 0.8s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );

  // ── Inline (default) ─────────────────────────────────────────
  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <Spinner />
        {message && (
          <p className={`font-headline font-semibold text-on-surface ${textSize}`}>
            {message}
          </p>
        )}
        {sub && (
          <p className="text-xs text-on-surface-variant">{sub}</p>
        )}
      </div>
    );
  }

  // ── Full-screen overlay ──────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center"
      style={{ background: '#12121d' }}
      role="status"
      aria-label="Loading application"
    >
      {/* Background orbs */}
      <div
        className="absolute w-[600px] h-[600px] orb-violet opacity-40 -z-10"
        style={{ top: '10%', left: '20%' }}
      />
      <div
        className="absolute w-[400px] h-[400px] orb-cyan opacity-25 -z-10"
        style={{ bottom: '15%', right: '15%' }}
      />

      {/* Logo + Spinner */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="text-5xl animate-float">🤝</div>

        <Spinner />

        <div className="text-center">
          {message ? (
            <>
              <p className="font-headline font-bold text-lg text-on-surface mb-1">
                {message}
              </p>
              {sub && (
                <p className="text-sm text-on-surface-variant">{sub}</p>
              )}
            </>
          ) : (
            <>
              <p className="font-headline font-bold text-xl text-gradient mb-1">
                NegotiateX
              </p>
              <p className="text-sm text-on-surface-variant">
                Loading your experience...
              </p>
            </>
          )}
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: spinnerColor,
                animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
