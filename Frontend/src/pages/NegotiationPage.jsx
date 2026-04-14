import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNegotiation } from '../context/NegotiationContext';
import { negotiationApi } from '../api/endpoints';
import NegotiationChat from '../components/NegotiationChat';
import { GlassCard, Button, LoadingSpinner } from '../components/ui';

/**
 * NegotiationPage — The tactical bargaining dashboard
 */
const NegotiationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { startSession } = useNegotiation();
  
  const [product, setProduct] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const selectedProduct = location.state?.product;
    if (!selectedProduct) {
      setError('No product selected. Redirecting to vault...');
      setTimeout(() => navigate('/products'), 2000);
      return;
    }
    setProduct(selectedProduct);
    initializeNegotiationSession(selectedProduct);
  }, [location, navigate]);

  const initializeNegotiationSession = async (selectedProduct) => {
    try {
      setIsInitializing(true);
      setError(null);
      const response = await negotiationApi.startSession({
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        originalPrice: selectedProduct.price,
        userInitialPrice: selectedProduct.price,
      });

      if (response.data.success) {
        const session = response.data.data;
        setSessionId(session._id || session.id);
        startSession(session);
      } else {
        setError(response.data.message || 'Transmission failed.');
      }
    } catch (err) {
      setError('Uplink failed. Please check your credentials.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDealAccepted = async (dealData) => {
    navigate('/products', {
      state: { 
        dealCompleted: true,
        product: product,
        finalPrice: dealData.finalPrice,
      },
    });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="xl" />
        <p className="mt-8 text-on-surface-variant font-label font-bold uppercase tracking-[0.3em] animate-pulse">
          Establishing Secure Uplink...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard tier="elevated" glow="danger" className="max-w-md text-center py-12">
          <div className="text-5xl mb-6">🚫</div>
          <h2 className="text-2xl font-headline font-bold text-danger mb-4">Access Denied</h2>
          <p className="text-on-surface-variant mb-10">{error}</p>
          <Button variant="primary" as="button" onClick={() => navigate('/products')}>
            Return to Marketplace
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-stretch">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] orb-violet opacity-10 pointer-events-none -z-10" />

      {/* ── Left Sidebar (Product Intelligence) ── */}
      <aside className="lg:w-1/3 flex flex-col gap-6 animate-fade-in-right">
        <GlassCard tier="low" className="p-0 overflow-hidden">
          <div className="relative h-48 bg-surface-dim flex items-center justify-center">
            <img src={product.image} alt={product.title} className="h-full w-full object-contain mix-blend-lighten p-6" />
            <div className="absolute top-4 left-4">
              <span className="badge badge-cyan text-[10px]">MARKET OBJECT</span>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-2">{product.title}</h2>
            <div className="flex items-center gap-3 py-3 border-y border-outline-variant/10 mb-6">
              <span className="text-display-xs font-bold text-gradient-violet">${product.price.toFixed(2)}</span>
              <span className="text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-widest leading-none">Standard Rate</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-label font-bold text-secondary uppercase tracking-[0.2em]">Target Intelligence</h3>
              {[
                { label: 'Merchant', val: 'AI Custodian' },
                { label: 'Volatility', val: 'High' },
                { label: 'Max Discount', val: '25%' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">{stat.label}:</span>
                  <span className="text-on-surface font-bold">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard tier="low" glow="violet" padding="p-6">
          <h3 className="text-xs font-label font-bold text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="text-base text-primary">💡</span> Strategy Tips
          </h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              Start with a 50-60% anchor offer to gauge reaction.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              Provide rationales (e.g., condition, local competition).
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              Observe the Leverage Meter for bargaining efficiency.
            </li>
          </ul>
        </GlassCard>
      </aside>

      {/* ── Main Chat Deck ── */}
      <main className="lg:w-2/3 flex-grow animate-fade-in-up">
        <GlassCard tier="elevated" padding="p-0" className="h-full flex flex-col min-h-[600px] border-outline-variant/20 shadow-bloom-violet/10">
          {/* Header */}
          <div className="px-6 py-4 bg-surface-high/40 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-astral-gradient flex items-center justify-center text-xl shadow-bloom-violet sm:flex">
                🤝
              </div>
              <div>
                <h2 className="text-base font-headline font-bold text-on-surface">Terminal Active</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-label font-bold text-on-surface-variant/60 uppercase tracking-widest">Secure Communication</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-[10px] font-bold tracking-widest uppercase">
              Abort Session
            </Button>
          </div>

          {/* Chat Component */}
          <div className="flex-grow">
            <NegotiationChat
              product={product}
              sessionId={sessionId}
              onDealAccepted={handleDealAccepted}
            />
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default NegotiationPage;

