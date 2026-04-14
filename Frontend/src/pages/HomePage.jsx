import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button } from '../components/ui';

/**
 * HomePage — Premium Astral Architect Landing Page
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🤖',
      title: 'Smart AI Shopkeeper',
      desc: 'Negotiate with advanced AI personas that adapt to your tactics and pressure levels.',
      color: 'violet'
    },
    {
      icon: '🏆',
      title: 'Global Leaderboard',
      desc: 'Climb the ranks by securing the deepest discounts. Compete with top negotiators worldwide.',
      color: 'cyan'
    },
    {
      icon: '💰',
      title: 'Real Savings Tracker',
      desc: 'Track your negotiation efficiency and total currency saved across all successful deals.',
      color: 'violet'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── Background Effects ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid opacity-20 -z-10" />
      <div className="absolute inset-0 bg-hero-mesh opacity-60 -z-10" />

      {/* Animated Orbs */}
      <div className="orb-violet w-[500px] h-[500px] top-[-10%] right-[-5%] opacity-30 animate-float" />
      <div className="orb-cyan w-[400px] h-[400px] bottom-[10%] left-[-10%] opacity-20 animate-float-slow" />

      <div className="section-container pt-20 pb-20">
        {/* ── Hero Section ─────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto text-center mb-24 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-high/50 border border-outline-variant/30 mb-8 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="animate-pulse">✨</span>
            <span className="text-xs font-label font-semibold uppercase tracking-widest text-secondary">
              The Protocol is Live
            </span>
          </div>

          <h1 className="text-display-md md:text-display-lg font-bold mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Master the Art of <br />
            <span className="text-gradient">Negotiation</span>
          </h1>

          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            Challenge our high-stakes AI shopkeepers, sharpen your persuasion skills,
            and walk away with premium deals. The market is waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {isAuthenticated ? (
              <Button
                as={Link}
                to="/products"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto px-10"
              >
                Start Negotiating Now
              </Button>
            ) : (
              <Button
                as={Link}
                to="/register"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto px-10"
              >
                Join the Protocol
              </Button>
            )}

            <Button
              as={Link}
              to="/leaderboard"
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto px-10"
            >
              View Leaderboard
            </Button>
          </div>
        </div>

        {/* ── Features Section ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <GlassCard
              key={f.title}
              hover
              glow={f.color}
              className={`animate-fade-in-up`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="text-4xl mb-6 flex justify-center md:justify-start">{f.icon}</div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-3 text-center md:text-left">
                {f.title}
              </h3>
              <p className="text-on-surface-variant text-base leading-relaxed text-center md:text-left">
                {f.desc}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* ── Stats Ribbon (Social Proof) ──────────────────────── */}
        <div className="mt-32 pt-16 border-t border-outline-variant/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '50K+', label: 'Negotiators' },
              { val: '$5M+', label: 'Total Savings' },
              { val: '100K+', label: 'Deals Closed' },
              { val: '98%', label: 'AI Accuracy' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${600 + i * 100}ms` }}>
                <div className="text-3xl font-headline font-bold text-gradient mb-1">
                  {stat.val}
                </div>
                <div className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

