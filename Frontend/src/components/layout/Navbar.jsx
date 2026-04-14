import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar — Astral Architect glassmorphic top navigation
 * - Glassmorphic blur background
 * - Scroll-aware: hides on scroll down, shows on scroll up
 * - Auth-state aware: shows Login/Register OR user avatar dropdown
 * - Mobile responsive hamburger menu
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible]       = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ── Scroll-aware visibility ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScrollY || current < 60) {
        setVisible(true);
      } else if (current > lastScrollY && current > 80) {
        setVisible(false);
        setMenuOpen(false);
        setDropdownOpen(false);
      }
      setLastScrollY(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // ── Close dropdown when clicking outside ──────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Close mobile menu on route change ─────────────────────────
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/',           label: 'Home' },
    { to: '/products',   label: 'Store',       auth: true },
    { to: '/leaderboard',label: 'Leaderboard', auth: true },
  ];

  const visibleLinks = navLinks.filter(
    (l) => !l.auth || isAuthenticated
  );

  // Initials for avatar fallback
  const initials = (user?.displayName || user?.username || '?')
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────────────────── */}
      <nav
        className={`navbar-glass transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="NegotiateX Home"
            >
              <span className="text-2xl">🤝</span>
              <span
                className="text-xl font-headline font-bold text-gradient tracking-tight
                           group-hover:opacity-90 transition-opacity"
              >
                NegotiateX
              </span>
            </Link>

            {/* ── Desktop Nav Links ──────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {visibleLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive(to)
                      ? 'text-primary bg-primary-container/15'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/60'
                    }`}
                >
                  {label}
                  {/* Active indicator dot */}
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-container" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Auth ───────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                /* User Avatar + Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full
                               border border-outline-variant/25 hover:border-outline-variant/50
                               bg-surface-high/50 hover:bg-surface-high/80
                               transition-all duration-200 group"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {/* Avatar */}
                    <div className="avatar-ring w-8 h-8 flex items-center justify-center
                                    text-sm font-bold text-primary bg-primary-container/30 overflow-hidden">
                      {user?.avatar
                        ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        : initials
                      }
                    </div>
                    <span className="text-sm font-medium text-on-surface max-w-[120px] truncate">
                      {user?.displayName || user?.username}
                    </span>
                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 text-on-surface-variant transition-transform duration-200
                                  ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 glass-card-floating
                                    py-1.5 animate-scale-in z-60">
                      <div className="px-4 py-2.5 border-b border-outline-variant/20">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/products"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant
                                   hover:text-on-surface hover:bg-surface-high/60 transition-colors"
                      >
                        <span>🏪</span> Store
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant
                                   hover:text-on-surface hover:bg-surface-high/60 transition-colors"
                      >
                        <span>👤</span> My Profile
                      </Link>
                      <Link
                        to="/leaderboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant
                                   hover:text-on-surface hover:bg-surface-high/60 transition-colors"
                      >
                        <span>🏆</span> Leaderboard
                      </Link>

                      <div className="border-t border-outline-variant/20 mt-1.5 pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-danger hover:bg-danger/10 transition-colors text-left"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest buttons */
                <>
                  <Link
                    to="/login"
                    className="btn-violet-outline btn-primary-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary btn-primary-sm"
                  >
                    Get Started →
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile Hamburger ───────────────────────────────── */}
            <button
              className="md:hidden p-2 rounded-lg text-on-surface-variant
                         hover:text-on-surface hover:bg-surface-high/60 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden border-t border-outline-variant/20 animate-fade-in">
            <div className="section-container py-3 space-y-1">
              {visibleLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(to)
                      ? 'text-primary bg-primary-container/15'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/60'
                    }`}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-3 pb-1 border-t border-outline-variant/20 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="avatar-ring w-9 h-9 flex items-center justify-center
                                      text-sm font-bold text-primary bg-primary-container/30 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-xs text-on-surface-variant">{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/profile"
                      className="block px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface
                                 hover:bg-surface-high/60 rounded-lg transition-colors">
                      👤 My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-danger
                                 hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"   className="btn-violet-outline text-center">Sign In</Link>
                    <Link to="/register" className="btn-primary text-center">Get Started →</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Spacer so page content doesn't hide under fixed nav ── */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Navbar;
