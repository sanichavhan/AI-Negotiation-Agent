import React, { useState, useEffect, useRef } from 'react';
import { useNegotiation } from '../context/NegotiationContext';
import { negotiationApi } from '../api/endpoints';
import { GlassCard, Button, LoadingSpinner } from './ui';

/**
 * LeverageMeter — Visual indicator of negotiation success
 */
const LeverageMeter = ({ current, original, target = 0.75 }) => {
  const discount = original > 0 ? ((original - current) / original) * 100 : 0;
  const targetPct = (1 - target) * 100; // e.g., 25% discount
  const progress = Math.min((discount / targetPct) * 100, 100);
  
  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">
          Bargain Leverage
        </span>
        <span className="text-sm font-headline font-bold text-primary">
          {discount.toFixed(1)}% <span className="text-[10px] text-on-surface-variant/60 font-medium">OFF</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden border border-outline-variant/10">
        <div 
          className="h-full bg-astral-gradient transition-all duration-700 ease-out shadow-[0_0_12px_rgba(124,58,237,0.4)]"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>
    </div>
  );
};

/**
 * NegotiationChat — High-fidelity terminal for AI bargaining
 */
const NegotiationChat = ({ product, sessionId, onDealAccepted }) => {
  const { messages, addMessage, incrementRound, setLoading } = useNegotiation();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dealStatus, setDealStatus] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(product?.price || 0);
  const [isDealAcceptable, setIsDealAcceptable] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const messageText = userInput;
    const priceMatch = messageText.match(/\$?(\d+(?:\.\d{1,2})?)/);
    const extractedOffer = priceMatch ? parseFloat(priceMatch[1]) : null;
    
    addMessage({
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    });
    setUserInput('');
    setIsLoading(true);
    setLoading(true);

    try {
      const response = await negotiationApi.sendMessage(sessionId, { message: messageText });
      if (response.data.success) {
        const apiData = response.data.data;
        const aiResponseText = apiData.message || apiData.aiResponse || 'No response';
        
        if (apiData.newPrice || apiData.counterPrice) {
          const newAIPrice = apiData.newPrice || apiData.counterPrice;
          setCurrentPrice(newAIPrice);
          if (extractedOffer !== null && extractedOffer >= newAIPrice) {
            setIsDealAcceptable(true);
          }
        }
        
        addMessage({
          role: 'ai',
          content: aiResponseText,
          timestamp: new Date(),
        });
        incrementRound();
      }
    } catch (error) {
      addMessage({
        role: 'system',
        content: `Connection error. Please retry.`,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAcceptDeal = async () => {
    try {
      const response = await negotiationApi.acceptDeal(sessionId);
      if (response.data.success) {
        setDealStatus('accepted');
        setTimeout(() => {
          if (onDealAccepted) onDealAccepted({ finalPrice: currentPrice, sessionId });
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Chat Canvas ────────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-outline-variant/20 hover:scrollbar-thumb-outline-variant/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 animate-pulse">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-label font-bold uppercase tracking-[0.2em] text-xs">
              Awaiting Initial Transmission
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`
                  relative px-5 py-4 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-bloom-violet' 
                    : msg.role === 'system'
                    ? 'bg-danger/10 border border-danger/20 text-danger text-center animate-shake'
                    : 'bg-surface-high/60 backdrop-blur-md border border-outline-variant/30 text-on-surface rounded-tl-none shadow-sm'
                  }
                `}>
                  {msg.content}
                  
                  {/* Timestamp */}
                  <div className={`
                    absolute bottom-[-18px] text-[10px] font-label opacity-40 whitespace-nowrap
                    ${msg.role === 'user' ? 'right-0' : 'left-0'}
                  `}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-surface-high/40 p-3 rounded-xl border border-outline-variant/20">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

        {dealStatus === 'accepted' && (
          <div className="py-8 animate-scale-in">
            <GlassCard tier="floating" glow="cyan" className="text-center p-8 border-success/30">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-headline font-bold text-success mb-2">Deal Synchronized</h3>
              <p className="text-on-surface-variant text-sm">Contract finalized at ${currentPrice.toFixed(2)}.</p>
            </GlassCard>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Interaction Terminal ───────────────────────────────── */}
      <div className="p-6 bg-surface-base/80 border-t border-outline-variant/20 backdrop-blur-xl">
        {dealStatus !== 'accepted' && (
          <>
            <LeverageMeter current={currentPrice} original={product.price} />

            <div className="flex flex-col gap-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Transmit offer... (e.g., $45 is my limit)"
                  disabled={isLoading}
                  className="input-field bg-surface-high/30 flex-grow"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  variant="primary"
                  className="px-8 min-w-[100px]"
                >
                  SEND
                </Button>
              </form>

              <Button
                onClick={handleAcceptDeal}
                disabled={isLoading || !isDealAcceptable}
                variant={isDealAcceptable ? "secondary" : "ghost"}
                fullWidth
                size="lg"
                glow={isDealAcceptable ? 'cyan' : 'none'}
              >
                {isDealAcceptable ? '✅ SEAL THE DEAL' : '🔒 TARGET PRICE NOT REACHED'}
              </Button>
              
              {!isDealAcceptable && messages.length > 0 && (
                <p className="text-[10px] text-center font-label font-bold text-secondary uppercase tracking-[0.2em] animate-pulse">
                  Negotiation Intensity Increasing
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NegotiationChat;

