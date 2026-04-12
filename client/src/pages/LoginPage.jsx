import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuthHook';
import { GlassCard, Button } from '../components/ui';

/**
 * LoginPage — High-fidelity centered auth experience
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const { login, loading, error } = useAuthHook();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      contextLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background orbs */}
      <div className="orb-violet w-[600px] h-[600px] -top-20 -left-20 opacity-20" />
      <div className="orb-cyan w-[400px] h-[400px] -bottom-10 -right-10 opacity-15" />

      <GlassCard 
        tier="floating" 
        padding="p-0" 
        className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-scale-in"
      >
        {/* ── Left Panel (Decorative) ──────────────────────────── */}
        <div className="w-full md:w-5/12 bg-astral-gradient p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle grid on left panel */}
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <span className="text-3xl text-white">🤝</span>
              <span className="text-xl font-headline font-bold tracking-tight">NegotiateX</span>
            </Link>
            
            <h2 className="text-3xl font-headline font-bold mb-6 leading-tight">
              Welcome Back to the Protocol.
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              Your negotiation sessions are waiting. Log in to continue closing premium deals and climbing the ranks.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                🤖
              </div>
              <p className="text-sm font-medium">Synced AI Logic</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                🏆
              </div>
              <p className="text-sm font-medium">Leaderboard Progress</p>
            </div>
          </div>
        </div>

        {/* ── Right Panel (Form) ────────────────────────────────── */}
        <div className="w-full md:w-7/12 p-10 md:p-14 bg-surface-base/40">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
              Account Login
            </h3>
            <p className="text-on-surface-variant text-sm mb-8">
              Enter your credentials to access your terminal.
            </p>

            {error && (
              <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm mb-6 animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="input-label mb-0">Password</label>
                  <a href="#" className="text-xs text-secondary hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                >
                  Authorize Access
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20">
              <p className="text-sm text-center text-on-surface-variant">
                New to the protocol?{' '}
                <Link to="/register" className="text-secondary font-bold hover:underline">
                  Create Agent Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LoginPage;

