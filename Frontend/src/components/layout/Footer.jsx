import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer — Astral Architect dark footer
 * - Brand logo + tagline
 * - 4-column links: Features / Quick Links / Support / Social
 * - Stats ribbon: 50K+ Users | 100K+ Negotiations | $5M+ Saved
 * - Newsletter email subscription
 * - Legal + copyright
 */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  const stats = [
    { value: '50K+',  label: 'Active Users' },
    { value: '100K+', label: 'Negotiations' },
    { value: '$5M+',  label: 'Total Saved' },
    { value: '98%',   label: 'Satisfaction' },
    { value: '24/7',  label: 'AI Available' },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #12121d 0%, #0d0d18 100%)',
          borderTop: '1px solid rgba(74, 68, 85, 0.2)',
        }}
      />
      {/* Ambient orbs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 orb-violet opacity-30 -z-10" />
      <div className="absolute -bottom-16 right-1/4 w-80 h-80 orb-cyan   opacity-20 -z-10" />

      <div className="section-container pt-16 pb-8">

        {/* ── Newsletter Banner ────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 mb-14"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(6,182,212,0.2) 100%)',
                   border: '1px solid rgba(124,58,237,0.25)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-1">
                Stay in the Loop
              </h3>
              <p className="text-on-surface-variant text-sm">
                Get tips on negotiation tactics and exclusive promotions.
              </p>
            </div>
            {subscribed ? (
              <div className="badge badge-success text-base px-6 py-3 animate-scale-in">
                ✅ You're subscribed!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 w-full md:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="input-field flex-1 md:w-64"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── 4-Column Links ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <span className="text-2xl">🤝</span>
              <span className="text-lg font-headline font-bold text-gradient">NegotiateX</span>
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
              Master the art of negotiation through AI-powered challenges.
              Real products, real skills, real savings.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: '𝕏', label: 'Twitter/X' },
                { icon: 'f', label: 'Facebook' },
                { icon: 'in', label: 'LinkedIn' },
                { icon: '▶', label: 'YouTube' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg
                             bg-surface-high/60 border border-outline-variant/25
                             text-on-surface-variant hover:text-secondary hover:border-secondary/40
                             hover:bg-secondary/10 transition-all duration-200 text-sm font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-headline font-semibold text-on-surface uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5">
              {[
                '✨ AI Negotiation',
                '🏆 Leaderboard',
                '📊 Analytics',
                '💰 Deal Tracker',
                '🎯 Tactics Guide',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-on-surface-variant hover:text-secondary transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-headline font-semibold text-on-surface uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/products"    className="text-sm text-on-surface-variant hover:text-secondary transition-colors">Shop Products</Link></li>
              <li><Link to="/leaderboard" className="text-sm text-on-surface-variant hover:text-secondary transition-colors">Leaderboard</Link></li>
              <li><Link to="/profile"     className="text-sm text-on-surface-variant hover:text-secondary transition-colors">My Profile</Link></li>
              <li><a href="#"             className="text-sm text-on-surface-variant hover:text-secondary transition-colors">Blog</a></li>
              <li><a href="#"             className="text-sm text-on-surface-variant hover:text-secondary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-headline font-semibold text-on-surface uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@negotiatex.ai"
                  className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  📧 support@negotiatex.ai
                </a>
              </li>
              <li className="text-sm text-on-surface-variant">💬 Live Chat Available</li>
              <li className="text-sm text-on-surface-variant">⏰ 24/7 AI Support</li>
              <li><a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-colors">Status Page</a></li>
            </ul>
          </div>
        </div>

        {/* ── Stats Ribbon ─────────────────────────────────────── */}
        <div
          className="grid grid-cols-3 md:grid-cols-5 gap-4 py-8 mb-8"
          style={{ borderTop: '1px solid rgba(74,68,85,0.2)', borderBottom: '1px solid rgba(74,68,85,0.2)' }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-headline font-bold text-gradient mb-0.5">{value}</p>
              <p className="text-xs text-on-surface-variant font-label uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Legal + Copyright ────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-on-surface-variant hover:text-secondary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant text-center">
            © {currentYear} NegotiateX. All rights reserved. | Master negotiation, one deal at a time.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
