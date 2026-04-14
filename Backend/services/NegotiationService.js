/**
 * Negotiation Service
 * Handles all game logic for negotiations
 */

class NegotiationService {
  /**
   * Generate hidden seller parameters
   * These are constraints the AI seller must follow
   */
  static generateSellerParameters(productInitialPrice) {
    // Minimum price: 40-70% of initial price
    const minPriceRatio = Math.random() * 0.3 + 0.4; // 0.4-0.7
    const minimumPrice = Math.round(productInitialPrice * minPriceRatio);

    // Target profit: difference between initial and minimum
    const targetProfit = productInitialPrice - minimumPrice;

    // Patience level: 1-10 scale
    const patienceLevel = Math.floor(Math.random() * 10) + 1;

    // Strategy: random seller strategy
    const strategies = ['aggressive', 'friendly', 'logical', 'psychological'];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

    // Emotional state: 0-1 (starts at 0.5)
    const emotionalState = 0.5;

    return {
      minimumPrice,
      targetProfit,
      patienceLevel,
      strategy,
      emotionalState,
    };
  }

  /**
   * Calculate price adjustment based on negotiation strategy
   */
  static calculatePriceAdjustment(
    currentPrice,
    minimumPrice,
    roundNumber,
    strategy,
    buyerPersuasion = 0
  ) {
    // Base reduction: 2% per round
    const baseReduction = currentPrice * 0.02;

    // Strategy multipliers
    const multipliers = {
      aggressive: 0.5, // Smaller reductions (1% per round)
      friendly: 2.0, // Larger reductions (4% per round)
      logical: 1.0, // Steady reductions (2% per round)
      psychological: Math.random() * 2.5 + 0.5, // Random (0.5x - 3x)
    };

    const multiplier = multipliers[strategy] || 1.0;
    let newPrice =
      currentPrice - baseReduction * multiplier - buyerPersuasion * 0.01;

    // Never go below minimum price
    newPrice = Math.max(newPrice, minimumPrice);

    // Round to 2 decimal places
    newPrice = Math.round(newPrice * 100) / 100;

    return newPrice;
  }

  /**
   * Calculate final score for leaderboard
   * Lower score = better ranking
   */
  static calculateScore(initialPrice, finalPrice, discountPercentage) {
    // Score = finalPrice + penalty for fewer discounts
    // Higher discount = lower score (better)
    const discountBonus = (discountPercentage / 100) * initialPrice;
    const score = finalPrice - discountBonus;

    return Math.round(score * 100) / 100;
  }

  /**
   * Determine if negotiation should end
   */
  static shouldEndNegotiation(
    roundNumber,
    maxRounds,
    buyerOffer,
    minimumPrice,
    patienceLevel
  ) {
    // Check conditions:
    // 1. Max rounds reached?
    if (roundNumber >= maxRounds) {
      return true;
    }

    // 2. Buyer offer below minimum?
    if (buyerOffer !== null && buyerOffer !== undefined) {
      if (buyerOffer < minimumPrice) {
        return true;
      }
    }

    // 3. Seller patience exhausted? (based on rounds)
    // Higher patience level = more willing to continue
    const patienceThreshold = (11 - patienceLevel) * 2; // 2-20 rounds
    if (roundNumber >= patienceThreshold) {
      return true;
    }

    return false;
  }

  /**
   * Parse buyer message for negotiation signals
   * (Delegated to NegotiationAgent.analyzeBuyerMessage)
   */
  static analyzeBuyerMessage(message) {
    // This is now handled by NegotiationAgent class
    // Keeping this for backwards compatibility
    const lowerMessage = message.toLowerCase();

    const analysis = {
      hasOffer: false,
      offeredPrice: null,
      sentiment: 'neutral',
      urgency: 'low',
      walkingAway: false,
    };

    // Detect price offers
    const priceRegex = /(\d+(?:\.\d{1,2})?)/g;
    const prices = message.match(priceRegex);
    if (prices) {
      analysis.offeredPrice = parseFloat(prices[prices.length - 1]);
      analysis.hasOffer = true;
    }

    // Detect sentiment
    const positiveWords = ['great', 'perfect', 'love', 'excellent', 'amazing'];
    const negativeWords = ['terrible', 'awful', 'hate', 'useless', 'worst'];
    const walkAwayWords = ['forget', 'no', "won't", 'not interested', 'goodbye'];

    if (positiveWords.some((word) => lowerMessage.includes(word))) {
      analysis.sentiment = 'positive';
    } else if (negativeWords.some((word) => lowerMessage.includes(word))) {
      analysis.sentiment = 'negative';
    }

    if (walkAwayWords.some((word) => lowerMessage.includes(word))) {
      analysis.walkingAway = true;
    }

    // Detect urgency
    const urgencyWords = ['now', 'today', 'asap', 'hurry', 'quickly'];
    if (urgencyWords.some((word) => lowerMessage.includes(word))) {
      analysis.urgency = 'high';
    } else if (lowerMessage.includes('soon')) {
      analysis.urgency = 'medium';
    }

    return analysis;
  }

  /**
   * Generate AI response based on strategy
   * (Delegated to NegotiationAgent class)
   */
  static async generateAIResponse(
    sellerState,
    buyerMessage,
    conversationHistory
  ) {
    // This delegates to the NegotiationAgent (LangChain + Mistral)
    // Returns: { success, response, newPrice, reasoning, emotion }
    // Note: This method is called from NegotiationAgent
    // Implementation is in NegotiationAgent.generateResponse()
  }
}

export default NegotiationService;
