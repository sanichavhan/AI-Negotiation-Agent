import { Mistral } from '@mistralai/mistralai';

/**
 * AI Negotiation Agent using Mistral AI API
 * Handles real-time negotiation with buyer
 */
class NegotiationAgent {
  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY;
    
    // Don't validate here - will validate when API is actually used
    // This allows server to start even if key is missing
    if (this.apiKey) {
      console.log('✅ Mistral API key loaded from environment');
      this.client = new Mistral({
        apiKey: this.apiKey,
      });
    } else {
      console.warn('⚠️  Mistral API key not set. AI negotiation will fail until configured.');
      this.client = null;
    }
  }

  /**
   * Validate API key before making requests
   */
  _validateApiKey() {
    if (!this.apiKey) {
      throw new Error(
        'Mistral API key not configured. Please add MISTRAL_API_KEY to your .env file.'
      );
    }
    if (this.apiKey.length < 10) {
      throw new Error('Invalid Mistral API key format. Key appears too short.');
    }
  }

  /**
   * Generate AI response to buyer's message
   */
  async generateResponse(negotiationState, buyerMessage) {
    try {
      // Validate API key before attempting to use it
      this._validateApiKey();

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
        isBelowMinimumPrice = false,
        buyerOffer = null,
      } = negotiationState;

      // Build persuasion strategy when buyer goes below minimum price
      let belowMinimumInstructions = '';
      if (isBelowMinimumPrice && buyerOffer !== null) {
        const priceGap = minimumPrice - buyerOffer;
        const gapPercentage = ((priceGap / minimumPrice) * 100).toFixed(1);
        belowMinimumInstructions = `

CRITICAL - BUYER OFFER IS EXTREMELY LOW:
- Buyer offered: $${Math.round(buyerOffer)}
- This is ${gapPercentage}% below your absolute lowest acceptable price
- DO NOT reveal your exact minimum threshold to the buyer
- DO NOT accept or agree to this price
- Use PERSUASIVE TECHNIQUES to convince them to increase their offer:
  * Highlight product quality, features, and value proposition
  * Explain your costs and why you can't go lower
  * Appeal to fairness and mutual benefit
  * Use strategic reasoning ("This product is worth more because...")
  * Remind them of market rates and competition
  * Create urgency or scarcity ("Others are interested at a better price")
  * Make a reasonable counter-offer that's still above your minimum (at least $${Math.round(minimumPrice)})`; 
      }

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
${belowMinimumInstructions}

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact format:
{"response": "Your negotiation response message", "newPrice": <exact_number_here>, "reasoning": "Brief explanation", "emotion": 0.5}

CRITICAL: Always return valid JSON, never wrap it in markdown code blocks.`;

      const userPrompt = `Previous conversation context:\n${conversationHistory || 'No previous messages'}\n\nBuyer's message: "${buyerMessage}"\n\nRespond with your counter-offer.${isBelowMinimumPrice ? ' Remember, you must persuade them to increase their offer without revealing your rock-bottom price.' : ''}`;

      // Call Mistral API with error handling
      console.log('🚀 Calling Mistral API...', {
        model: 'mistral-small-latest',
        messageCount: 2,
        promptLength: userPrompt.length,
        belowMinimumPrice: isBelowMinimumPrice,
      });

      let response;
      try {
        response = await this.client.chat.complete({
          model: 'mistral-small-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          maxTokens: 500,
        });
        
        console.log('✅ Mistral API response received', {
          messageCount: response.choices?.length,
          contentLength: response.choices?.[0]?.message?.content?.length,
        });
      } catch (apiError) {
        console.error('❌ Mistral API call failed:', {
          errorMessage: apiError.message,
          errorCode: apiError.code,
          errorStatus: apiError.status,
          errorType: apiError.constructor.name,
        });
        
        // Check for specific error types
        if (apiError.message?.includes('401') || apiError.message?.includes('Unauthorized')) {
          throw new Error('Mistral API authentication failed. Check MISTRAL_API_KEY.');
        } else if (apiError.message?.includes('429')) {
          throw new Error('Mistral API rate limit exceeded. Try again later.');
        } else if (apiError.message?.includes('timeout')) {
          throw new Error('Mistral API request timeout.');
        } else {
          throw new Error(`Mistral API error: ${apiError.message}`);
        }
      }

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
        return this._generateFallbackResponse(
          currentPrice,
          minimumPrice,
          strategy,
          isBelowMinimumPrice,
          buyerOffer
        );
      }
    } catch (error) {
      console.error('❌ Critical error in generateResponse:', {
        errorMessage: error.message,
        errorStack: error.stack?.split('\n')[0],
        type: error.constructor.name,
      });
      
      // Re-throw with context
      const errorMsg = error.message || 'Unknown error in AI response generation';
      const err = new Error(`AI Agent Error: ${errorMsg}`);
      err.originalError = error;
      throw err;
    }
  }

  /**
   * Fallback response when LLM fails
   * Includes persuasive responses when buyer goes below minimum price
   */
  _generateFallbackResponse(currentPrice, minimumPrice, strategy, isBelowMinimumPrice = false, buyerOffer = null) {
    const strategies = {
      aggressive: {
        factor: 0.97,
        belowMinFactor: 0.98,
        normalResponses: [
          "I appreciate your interest, but that's too low for this product.",
          "This is a premium item. My price is fair for its quality.",
          "I can only go down slightly from here.",
        ],
        belowMinResponses: [
          "I appreciate your interest, but that offer doesn't work for me. This product has premium features worth more.",
          "I can't accept such a low offer. The market value is much higher than that.",
          "Your offer is unrealistic. I have other buyers interested at a better price.",
          "I need a more reasonable offer. The product's quality justifies a higher price.",
        ],
      },
      friendly: {
        factor: 0.94,
        belowMinFactor: 0.965,
        normalResponses: [
          "I appreciate your offer! Let me see what I can do for you.",
          "You drive a hard bargain! I can adjust my price.",
          "I want to work with you. Here's my best offer.",
        ],
        belowMinResponses: [
          "I appreciate your offer! However, I need more to make this work. Can we find a middle ground?",
          "You drive a hard bargain! But I do need to cover my costs. Let me offer you something better.",
          "I really want to work with you, but I can't go that low. Let's work together on a fair price.",
          "That's a bit low for me, but I like your negotiating style. How about a bit higher?",
        ],
      },
      logical: {
        factor: 0.96,
        belowMinFactor: 0.97,
        normalResponses: [
          "Based on current market value, here's my counter-offer.",
          "Let me provide a realistic adjustment based on the facts.",
          "Considering your points, I can offer this price.",
        ],
        belowMinResponses: [
          "Based on market analysis, your offer is below the fair value. Let me explain the costs involved.",
          "Your offer doesn't account for the product's features and durability. A fairer price would be higher.",
          "Considering manufacturing costs and market rates, I need at least this much.",
          "The data shows similar items at a higher price point. Your offer doesn't reflect the value.",
        ],
      },
      psychological: {
        factor: Math.random() * 0.1 + 0.92,
        belowMinFactor: 0.96,
        normalResponses: [
          "This is an incredible opportunity at this price!",
          "I'm willing to make a special deal just for you.",
          "Let me give you the best price I can offer.",
        ],
        belowMinResponses: [
          "I appreciate your confidence in the product! But this opportunity requires a better investment from your side.",
          "You're showing great interest, which means you know the value. A fairer offer would show that.",
          "This is still an incredible opportunity, but I need a price that reflects that.",
          "Let's be fair to each other. A better offer would really make this work.",
        ],
      },
    };

    const strategy_config = strategies[strategy] || strategies.logical;
    const factor = isBelowMinimumPrice ? strategy_config.belowMinFactor : strategy_config.factor;
    const responsesArray = isBelowMinimumPrice ? strategy_config.belowMinResponses : strategy_config.normalResponses;
    
    const newPrice = Math.max(
      Math.round(currentPrice * factor),
      minimumPrice
    );

    return {
      success: true,
      response: responsesArray[Math.floor(Math.random() * responsesArray.length)],
      newPrice,
      reasoning: isBelowMinimumPrice ? `Persuading buyer to increase offer - below acceptable threshold` : `Following ${strategy} strategy`,
      emotion: isBelowMinimumPrice ? 0.6 : 0.5,
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
