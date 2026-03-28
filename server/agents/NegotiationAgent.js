import { Mistral } from '@mistralai/mistralai';

/**
 * AI Negotiation Agent using Mistral AI API
 * Handles real-time negotiation with buyer
 */
class NegotiationAgent {
  constructor() {
    this.client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }

  /**
   * Generate AI response to buyer's message
   */
  async generateResponse(negotiationState, buyerMessage) {
    try {
      const {
        currentPrice,
        minimumPrice,
        targetProfit,
        strategy,
        patienceLevel,
        productName,
        roundNumber,
        maxRounds,
        conversationHistory = '',
      } = negotiationState;

      // Build the system and user prompts
      const systemPrompt = `You are a skilled ${strategy} ${productName} seller negotiating with a buyer.

SELLER CONSTRAINTS (must follow):
- Current asking price: ${Math.round(currentPrice)}
- ABSOLUTE minimum price: ${Math.round(minimumPrice)} (NEVER go below this)
- Target profit: ${Math.round(targetProfit)}
- Patience level: ${patienceLevel}/10 (higher = more willing to negotiate)

BUYER CONTEXT:
- Negotiation round: ${roundNumber}/${maxRounds}

INSTRUCTIONS:
1. Respond naturally as a seller, staying in character for your ${strategy} strategy
2. Address the buyer's points and concerns
3. Make a counter-offer if appropriate (must be >= ${Math.round(minimumPrice)})
4. Strategy guidelines:
   - Aggressive: Defend price, small reductions (2-3%)
   - Friendly: Show willingness, larger reductions (5-8%)
   - Logical: Justify price with facts, steady reductions (3-5%)
   - Psychological: Use emotions, unpredictable changes (2-10%)

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact format:
{"response": "Your negotiation response message", "newPrice": <exact_number_here>, "reasoning": "Brief explanation", "emotion": 0.5}

CRITICAL: Always return valid JSON, never wrap it in markdown code blocks.`;

      const userPrompt = `Previous conversation context:\n${conversationHistory || 'No previous messages'}\n\nBuyer's message: "${buyerMessage}"\n\nRespond with your counter-offer.`;

      // Call Mistral API
      const response = await this.client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 500,
      });

      // Parse response
      const responseText = response.choices[0].message.content.trim();

      try {
        // Remove markdown code blocks if present
        const cleanText = responseText
          .replace(/```json\n*/g, '')
          .replace(/```\n*/g, '')
          .trim();

        const parsedResponse = JSON.parse(cleanText);

        // Validate required fields
        if (!parsedResponse.response || parsedResponse.newPrice === undefined) {
          throw new Error('Invalid response format');
        }

        // Ensure price doesn't go below minimum
        const newPrice = Math.max(parsedResponse.newPrice, minimumPrice);

        return {
          success: true,
          response: parsedResponse.response,
          newPrice,
          reasoning: parsedResponse.reasoning || '',
          emotion: Math.min(Math.max(parsedResponse.emotion || 0.5, 0), 1),
        };
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        // Return fallback response
        return this._generateFallbackResponse(currentPrice, minimumPrice, strategy);
      }
    } catch (error) {
      console.error('Error in generateResponse:', error.message);
      throw error;
    }
  }

  /**
   * Fallback response when LLM fails
   */
  _generateFallbackResponse(currentPrice, minimumPrice, strategy) {
    const strategies = {
      aggressive: {
        factor: 0.97,
        responses: [
          "I appreciate your interest, but that's too low for this product.",
          "This is a premium item. My price is fair for its quality.",
          "I can only go down slightly from here.",
        ],
      },
      friendly: {
        factor: 0.94,
        responses: [
          "I appreciate your offer! Let me see what I can do for you.",
          "You drive a hard bargain! I can adjust my price.",
          "I want to work with you. Here's my best offer.",
        ],
      },
      logical: {
        factor: 0.96,
        responses: [
          "Based on current market value, here's my counter-offer.",
          "Let me provide a realistic adjustment based on the facts.",
          "Considering your points, I can offer this price.",
        ],
      },
      psychological: {
        factor: Math.random() * 0.1 + 0.92,
        responses: [
          "This is an incredible opportunity at this price!",
          "I'm willing to make a special deal just for you.",
          "Let me give you the best price I can offer.",
        ],
      },
    };

    const strategy_config = strategies[strategy] || strategies.logical;
    const newPrice = Math.max(
      Math.round(currentPrice * strategy_config.factor),
      minimumPrice
    );

    return {
      success: true,
      response:
        strategy_config.responses[
          Math.floor(Math.random() * strategy_config.responses.length)
        ],
      newPrice,
      reasoning: `Following ${strategy} strategy`,
      emotion: 0.5,
    };
  }

  /**
   * Analyze buyer message for sentiment and intent
   */
  async analyzeBuyerMessage(message) {
    try {
      // Simple keyword-based analysis until advanced NLP is implemented
      const lowerMessage = message.toLowerCase();

      const analysis = {
        hasOffer: false,
        offeredPrice: null,
        sentiment: 'neutral', // positive, negative, neutral
        urgency: 'low', // low, medium, high
        walkingAway: false,
      };

      // Detect price offers
      const priceRegex = /(\d+(?:\.\d{1,2})?)/g;
      const prices = message.match(priceRegex);
      if (prices) {
        analysis.offeredPrice = parseFloat(prices[prices.length - 1]);
        analysis.hasOffer = true;
      }

      // Detect sentiment markers
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
    } catch (error) {
      console.error('Error analyzing buyer message:', error.message);
      return {
        hasOffer: false,
        offeredPrice: null,
        sentiment: 'neutral',
        urgency: 'low',
        walkingAway: false,
      };
    }
  }
}

export default NegotiationAgent;
