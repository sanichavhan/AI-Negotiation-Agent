import NegotiationSession from '../models/NegotiationSession.js';
import Product from '../models/Product.js';
import Message from '../models/Message.js';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import NegotiationService from '../services/NegotiationService.js';
import NegotiationAgent from '../agents/NegotiationAgent.js';
import { AppError, successResponse, asyncHandler } from '../utils/errorHandler.js';

const agent = new NegotiationAgent();

/**
 * Start new negotiation session
 * POST /api/negotiation/start
 * Body: { productId }
 */
export const startSession = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Generate seller parameters
  const sellerParams = NegotiationService.generateSellerParameters(
    product.initialPrice
  );

  // Create negotiation session
  const session = await NegotiationSession.create({
    userId: req.userId,
    productId,
    productName: product.name,
    initialPrice: product.initialPrice,
    currentPrice: product.initialPrice,
    minimumPrice: sellerParams.minimumPrice,
    targetProfit: sellerParams.targetProfit,
    sellerStrategy: sellerParams.strategy,
    patienceLevel: sellerParams.patienceLevel,
  });

  successResponse(res, 201, {
    sessionId: session._id,
    productName: session.productName,
    initialPrice: session.initialPrice,
    currentPrice: session.currentPrice,
    roundNumber: session.roundNumber,
    maxRounds: session.maxRounds,
    status: session.status,
  }, 'Negotiation session started');
});

/**
 * Send message in negotiation
 * POST /api/negotiation/:sessionId/message
 * Body: { message, offerPrice? }
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { message, offerPrice } = req.body;

  if (!message || message.trim().length === 0) {
    throw new AppError('Message is required', 400);
  }

  // Get session
  const session = await NegotiationSession.findById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.userId.toString() !== req.userId.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  if (session.status !== 'active') {
    throw new AppError('This negotiation session is no longer active', 400);
  }

  if (session.roundNumber >= session.maxRounds) {
    throw new AppError('Maximum rounds reached', 400);
  }

  // Analyze buyer message
  const buyerAnalysis = await agent.analyzeBuyerMessage(message);

  // If buyer has made an offer, validate it
  let userOffer = offerPrice || buyerAnalysis.offeredPrice;
  if (userOffer !== null && userOffer !== undefined) {
    if (userOffer < session.minimumPrice) {
      throw new AppError(
        `Can't go below minimum price of $${session.minimumPrice}`,
        400
      );
    }
  }

  // Save user message
  await Message.create({
    sessionId,
    sender: 'user',
    content: message,
    userOffer,
    roundNumber: session.roundNumber,
  });

  // Generate conversation history for context
  const previousMessages = await Message.find({ sessionId }).limit(10);
  const conversationHistory = previousMessages
    .map((m) => `${m.sender}: ${m.content}`)
    .join('\n');

  // Get AI response
  const aiResponse = await agent.generateResponse(
    {
      currentPrice: session.currentPrice,
      minimumPrice: session.minimumPrice,
      targetProfit: session.targetProfit,
      strategy: session.sellerStrategy,
      patienceLevel: session.patienceLevel,
      productName: session.productName,
      roundNumber: session.roundNumber,
      maxRounds: session.maxRounds,
      conversationHistory,
    },
    message
  );

  if (!aiResponse.success) {
    throw new AppError('Failed to generate AI response', 500);
  }

  // Check if should end negotiation
  const shouldEnd = NegotiationService.shouldEndNegotiation(
    session.roundNumber,
    session.maxRounds,
    userOffer,
    session.minimumPrice,
    session.patienceLevel
  );

  // Save AI message
  const aiMessage = await Message.create({
    sessionId,
    sender: 'ai',
    content: aiResponse.response,
    aiCounterPrice: aiResponse.newPrice,
    aiReasoning: aiResponse.reasoning,
    roundNumber: session.roundNumber,
  });

  // Update session
  session.currentPrice = aiResponse.newPrice;
  session.roundNumber += 1;

  if (shouldEnd) {
    session.status = 'completed';
    session.finalPrice = aiResponse.newPrice;
    session.completedAt = new Date();
  }

  await session.save();

  successResponse(res, 200, {
    aiMessage: aiResponse.response,
    counterPrice: aiResponse.newPrice,
    reasoning: aiResponse.reasoning,
    roundNumber: session.roundNumber,
    sessionStatus: session.status,
    emotion: aiResponse.emotion,
  }, 'Message sent successfully');
});

/**
 * Get session details
 * GET /api/negotiation/:sessionId
 */
export const getSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await NegotiationSession.findById(sessionId).populate(
    'productId'
  );

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.userId.toString() !== req.userId.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  // Get messages
  const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });

  const discount =
    session.status === 'completed'
      ? ((session.initialPrice - session.finalPrice) / session.initialPrice) *
        100
      : 0;

  successResponse(res, 200, {
    sessionId: session._id,
    productName: session.productName,
    initialPrice: session.initialPrice,
    currentPrice: session.currentPrice,
    finalPrice: session.finalPrice,
    roundNumber: session.roundNumber,
    maxRounds: session.maxRounds,
    status: session.status,
    strategy: session.sellerStrategy,
    discount: Math.round(discount * 100) / 100,
    messages: messages.map((m) => ({
      sender: m.sender,
      content: m.content,
      userOffer: m.userOffer,
      counterPrice: m.aiCounterPrice,
      reasoning: m.aiReasoning,
      round: m.roundNumber,
    })),
  }, 'Session retrieved');

});

/**
 * Accept final deal
 * POST /api/negotiation/:sessionId/accept
 */
export const acceptDeal = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await NegotiationSession.findById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.userId.toString() !== req.userId.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  if (session.status !== 'active' && session.status !== 'completed') {
    throw new AppError('Cannot accept a session that is not negotiating', 400);
  }

  // Mark session as completed if still active
  if (session.status === 'active') {
    session.finalPrice = session.currentPrice;
    session.status = 'completed';
    session.completedAt = new Date();
  }

  await session.save();

  // Calculate and save leaderboard entry
  const discount = session.initialPrice - session.finalPrice;
  const discountPercentage = (discount / session.initialPrice) * 100;
  const score = NegotiationService.calculateScore(
    session.initialPrice,
    session.finalPrice,
    discountPercentage
  );

  const user = await User.findById(req.userId);

  const leaderboardEntry = await Leaderboard.create({
    userId: req.userId,
    username: user.username,
    userEmail: user.email,
    productName: session.productName,
    initialPrice: session.initialPrice,
    finalPrice: session.finalPrice,
    discount,
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    roundsUsed: session.roundNumber,
    score,
    sessionId,
    completedAt: new Date(),
  });

  // Update user statistics
  const userStats = await Leaderboard.find({ userId: req.userId });
  user.totalNegotiations = userStats.length;
  user.bestDeal = Math.min(...userStats.map((s) => s.finalPrice));
  user.averageDiscount =
    userStats.reduce((sum, s) => sum + s.discountPercentage, 0) /
    userStats.length;
  await user.save();

  successResponse(res, 200, {
    score,
    discount,
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    finalPrice: session.finalPrice,
    roundsUsed: session.roundNumber,
  }, 'Deal accepted and score calculated');
});

/**
 * Abandon negotiation session
 * POST /api/negotiation/:sessionId/abandon
 */
export const abandonSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await NegotiationSession.findById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.userId.toString() !== req.userId.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  if (session.status !== 'active') {
    throw new AppError('Session is already completed or abandoned', 400);
  }

  session.status = 'abandoned';
  session.completedAt = new Date();
  await session.save();

  successResponse(res, 200, null, 'Session abandoned');
});

/**
 * Get user's negotiation history
 * GET /api/negotiation/history
 */
export const getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const sessions = await NegotiationSession.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await NegotiationSession.countDocuments({ userId: req.userId });

  const sessionsData = sessions.map((s) => ({
    sessionId: s._id,
    productName: s.productName,
    initialPrice: s.initialPrice,
    finalPrice: s.finalPrice,
    status: s.status,
    roundsUsed: s.roundNumber,
    completedAt: s.completedAt,
  }));

  successResponse(res, 200, {
    sessions: sessionsData,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  }, 'History retrieved');
});
