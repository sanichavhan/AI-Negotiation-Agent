import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import { successResponse, asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * Get global leaderboard
 * GET /api/leaderboard?page=1&limit=50&timeframe=all
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, timeframe = 'all' } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query based on timeframe
  const query = {};
  if (timeframe !== 'all') {
    const now = new Date();
    if (timeframe === 'week') {
      query.createdAt = {
        $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      };
    } else if (timeframe === 'month') {
      query.createdAt = {
        $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
    }
  }

  // Get leaderboard entries sorted by score (lower is better)
  const entries = await Leaderboard.find(query)
    .sort({ score: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Leaderboard.countDocuments(query);

  // Format response
  const leaderboard = entries.map((entry, index) => ({
    rank: skip + index + 1,
    username: entry.username,
    productName: entry.productName,
    finalPrice: entry.finalPrice,
    initialPrice: entry.initialPrice,
    discount: entry.discount,
    discountPercentage: entry.discountPercentage,
    roundsUsed: entry.roundsUsed,
    score: entry.score,
    completedAt: entry.completedAt,
  }));

  successResponse(res, 200, {
    leaderboard,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    timeframe,
  }, 'Leaderboard retrieved');
});

/**
 * Get current user's statistics
 * GET /api/leaderboard/stats
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get all user's leaderboard entries
  const entries = await Leaderboard.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  if (entries.length === 0) {
    successResponse(res, 200, {
      totalNegotiations: 0,
      bestDeal: null,
      averageDiscount: 0,
      totalSavings: 0,
      averageRounds: 0,
      recentNegotiations: [],
    }, 'User statistics retrieved');
    return;
  }

  const totalSavings = entries.reduce((sum, e) => sum + e.discount, 0);
  const averageRounds =
    entries.reduce((sum, e) => sum + e.roundsUsed, 0) / entries.length;

  const recentNegotiations = entries.slice(0, 10).map((e) => ({
    productName: e.productName,
    finalPrice: e.finalPrice,
    initialPrice: e.initialPrice,
    discountPercentage: e.discountPercentage,
    completedAt: e.completedAt,
  }));

  successResponse(res, 200, {
    totalNegotiations: entries.length,
    bestDeal: user.bestDeal,
    averageDiscount: Math.round(user.averageDiscount * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    averageRounds: Math.round(averageRounds * 100) / 100,
    recentNegotiations,
  }, 'Statistics retrieved');
});

/**
 * Get user's personal best deals (leaderboard)
 * GET /api/leaderboard/personal?page=1&limit=20
 */
export const getUserPersonalLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get user's leaderboard entries sorted by score
  const entries = await Leaderboard.find({ userId: req.userId })
    .sort({ score: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Leaderboard.countDocuments({ userId: req.userId });

  const leaderboard = entries.map((entry, index) => ({
    rank: skip + index + 1,
    productName: entry.productName,
    finalPrice: entry.finalPrice,
    initialPrice: entry.initialPrice,
    discount: entry.discount,
    discountPercentage: entry.discountPercentage,
    roundsUsed: entry.roundsUsed,
    score: entry.score,
    completedAt: entry.completedAt,
  }));

  successResponse(res, 200, {
    leaderboard,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  }, 'Personal leaderboard retrieved');
});

/**
 * Get leaderboard for specific product
 * GET /api/leaderboard/product/:productId?page=1&limit=20
 */
export const getProductLeaderboard = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get leaderboard entries for specific product
  const entries = await Leaderboard.find({
    sessionId: { $in: await Leaderboard.find({}) },
  })
    .populate('sessionId', 'productId')
    .sort({ score: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Leaderboard.countDocuments();

  const leaderboard = entries
    .filter((entry) => entry.sessionId.productId == productId)
    .map((entry, index) => ({
      rank: skip + index + 1,
      username: entry.username,
      finalPrice: entry.finalPrice,
      initialPrice: entry.initialPrice,
      discount: entry.discount,
      discountPercentage: entry.discountPercentage,
      roundsUsed: entry.roundsUsed,
      score: entry.score,
      completedAt: entry.completedAt,
    }));

  successResponse(res, 200, {
    leaderboard,
    total: leaderboard.length,
    pages: Math.ceil(leaderboard.length / parseInt(limit)),
    currentPage: parseInt(page),
  }, 'Product leaderboard retrieved');
});
