import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout — wraps every page with the shared Navbar + Footer
 *
 * Props:
 *   children       — page content
 *   showFooter     — toggle footer (default true; set false for Negotiation chat)
 *   className      — extra classes on the <main> wrapper
 */
const Layout = ({ children, showFooter = true, className = '' }) => {
  const { pathname } = useLocation();

  // Scroll to top on every navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#12121d' }}>
      <Navbar />

      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
