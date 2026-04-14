import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuthHook';
import { GlassCard, Button } from '../components/ui';

/**
 * RegisterPage — Redesigned high-fidelity registration experience
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const { register, loading, error } = useAuthHook();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName
      );
      contextLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background orbs */}
      <div className="orb-violet w-[600px] h-[600px] -top-20 -right-20 opacity-20" />
      <div className="orb-cyan w-[400px] h-[400px] -bottom-10 -left-10 opacity-15" />

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
              Join the Negotiation Protocol.
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              Create your agent profile today and start mastering the art of the deal with high-stakes AI shopkeepers.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                ✨
              </div>
              <p className="text-sm font-medium">Free Market Access</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                📊
              </div>
              <p className="text-sm font-medium">Personalized Analytics</p>
            </div>
          </div>
        </div>

        {/* ── Right Panel (Form) ────────────────────────────────── */}
        <div className="w-full md:w-7/12 p-10 md:p-14 bg-surface-base/40">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
              Create Agent Account
            </h3>
            <p className="text-on-surface-variant text-sm mb-8">
              Initialize your credentials to begin training.
            </p>

            {error && (
              <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm mb-6 animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="agent_007"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Alex Smith"
                    className="input-field"
                  />
                </div>
              </div>

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
                <label className="input-label">Security Password</label>
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

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                >
                  Create Agent Profile
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20">
              <p className="text-sm text-center text-on-surface-variant">
                Already registered in the system?{' '}
                <Link to="/login" className="text-secondary font-bold hover:underline">
                  Sign In to Terminal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;

