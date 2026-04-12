import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NegotiationProvider } from './context/NegotiationContext';
import { Layout } from './components/layout';

// Pages
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import NegotiationPage from './pages/NegotiationPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage     from './pages/ProfilePage';
import ClothingStorePage from './pages/ClothingStorePage';

/**
 * Protected Route — redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * AppRoutes — defined inside providers so useAuth() works in Navbar
 */
const AppRoutes = () => (
  <Routes>
    {/* ── Public Routes (with Navbar + Footer) ──────────────── */}
    <Route
      path="/"
      element={
        <Layout>
          <HomePage />
        </Layout>
      }
    />

    {/* Auth pages — Navbar only, no Footer */}
    <Route
      path="/login"
      element={
        <Layout showFooter={false}>
          <LoginPage />
        </Layout>
      }
    />
    <Route
      path="/register"
      element={
        <Layout showFooter={false}>
          <RegisterPage />
        </Layout>
      }
    />

    {/* ── Protected Routes ──────────────────────────────────── */}
    <Route
      path="/products"
      element={
        <ProtectedRoute>
          <Layout>
            <ClothingStorePage />
          </Layout>
        </ProtectedRoute>
      }
    />

    {/* Negotiation — full-height chat: no Footer */}
    <Route
      path="/negotiation"
      element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <NegotiationPage />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/leaderboard"
      element={
        <ProtectedRoute>
          <Layout>
            <LeaderboardPage />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      }
    />

    {/* 404 → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/**
 * Main App Component
 */
const App = () => (
  <Router>
    <AuthProvider>
      <NegotiationProvider>
        <AppRoutes />
      </NegotiationProvider>
    </AuthProvider>
  </Router>
);

export default App;

