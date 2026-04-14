import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import { successResponse, asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * Remove duplicate leaderboard entries, keeping only one per session
 * This cleans up old duplicates from before the unique index was added
 * Returns statistics about cleanup
 */
const cleanupDuplicateLeaderboardEntries = async () => {
  try {
    let totalRemoved = 0;
    let sessionsWithDuplicates = 0;

    // Find all sessions that have multiple leaderboard entries
    const duplicates = await Leaderboard.aggregate([
      {
        $group: {
          _id: '$sessionId',
          count: { $sum: 1 },
          entries: { $push: '$$ROOT' },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    // For each session with duplicates, keep the most recent and delete others
    for (const dup of duplicates) {
      if (dup._id === null || dup._id === undefined) continue;

      const entries = dup.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const keepId = entries[0]._id;

      // Delete older entries, keep the most recent one
      const idsToDelete = entries.slice(1).map((e) => e._id);
      if (idsToDelete.length > 0) {
        await Leaderboard.deleteMany({ _id: { $in: idsToDelete } });
        totalRemoved += idsToDelete.length;
        sessionsWithDuplicates += 1;
        console.log(`Cleaned up ${idsToDelete.length} duplicate entries for session ${dup._id}`);
      }
    }

    console.log(`✅ Cleanup complete: Removed ${totalRemoved} duplicates across ${sessionsWithDuplicates} sessions`);
    
    return {
      duplicatesRemoved: totalRemoved,
      sessionsAffected: sessionsWithDuplicates,
    };
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    return {
      duplicatesRemoved: 0,
      sessionsAffected: 0,
      error: error.message,
    };
  }
};

/**
 * Get global leaderboard with user aggregated statistics OR recent purchases
 * GET /api/leaderboard?page=1&limit=50&sortBy=totalSavings&timeframe=all
 * sortBy options: totalSavings, averageDiscount, dealCount, averagePrice, recent
 * If sortBy=recent, returns individual purchases sorted by most recent first
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, sortBy = 'totalSavings', timeframe = 'all' } = req.query;

  // Clean up old duplicates before retrieving leaderboard
  await cleanupDuplicateLeaderboardEntries();

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build time filter for leaderboard entries
  // Use completedAt for 'recent' view, createdAt for other views
  const timeQuery = {};
  const timeField = sortBy === 'recent' ? 'completedAt' : 'createdAt';
  
  if (timeframe !== 'all') {
    const now = new Date();
    if (timeframe === 'week') {
      timeQuery[timeField] = {
        $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      };
    } else if (timeframe === 'month') {
      timeQuery[timeField] = {
        $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
    }
  }

  // If sortBy='recent', return individual purchases sorted by most recent first
  if (sortBy === 'recent') {
    const recentPurchases = await Leaderboard.find(timeQuery)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Leaderboard.countDocuments(timeQuery);

    const formattedPurchases = recentPurchases.map((purchase) => ({
      username: purchase.username,
      email: purchase.userEmail,
      productName: purchase.productName,
      initialPrice: Math.round(purchase.initialPrice * 100) / 100,
      finalPrice: Math.round(purchase.finalPrice * 100) / 100,
      discount: Math.round(purchase.discount * 100) / 100,
      discountPercentage: Math.round(purchase.discountPercentage * 100) / 100,
      roundsUsed: purchase.roundsUsed,
      completedAt: purchase.completedAt,
    }));

    successResponse(
      res,
      200,
      {
        purchases: formattedPurchases,
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        timeframe,
        sortBy: 'recent',
      },
      'Recent purchases retrieved'
    );
    return;
  }

  // Aggregate leaderboard data by user
  const userStats = await Leaderboard.aggregate([
    { $match: timeQuery },
    {
      $group: {
        _id: '$userId',
        username: { $first: '$username' },
        userEmail: { $first: '$userEmail' },
        dealCount: { $sum: 1 },
        totalSavings: { $sum: '$discount' },
        bestDeal: { $min: '$finalPrice' },
        worstDeal: { $max: '$finalPrice' },
        averageDiscount: { $avg: '$discountPercentage' },
        averagePrice: { $avg: '$finalPrice' },
        totalSpent: { $sum: '$finalPrice' },
        totalRounds: { $sum: '$roundsUsed' },
        lastDeal: { $max: '$completedAt' },
      },
    },
    {
      $sort:
        sortBy === 'totalSavings'
          ? { totalSavings: -1 }
          : sortBy === 'averageDiscount'
          ? { averageDiscount: -1 }
          : sortBy === 'dealCount'
          ? { dealCount: -1 }
          : sortBy === 'averagePrice'
          ? { averagePrice: 1 }
          : { totalSavings: -1 },
    },
    { $skip: skip },
    { $limit: parseInt(limit) },
  ]);

  // Get total unique users for pagination
  const totalUsers = await Leaderboard.distinct('userId', timeQuery);
  const total = totalUsers.length;

  // Format response with rank
  const leaderboard = userStats.map((user, index) => ({
    rank: skip + index + 1,
    userId: user._id,
    username: user.username,
    email: user.userEmail,
    dealCount: user.dealCount,
    totalSavings: Math.round(user.totalSavings * 100) / 100,
    bestDeal: Math.round(user.bestDeal * 100) / 100,
    worstDeal: Math.round(user.worstDeal * 100) / 100,
    averageDiscount: Math.round(user.averageDiscount * 100) / 100,
    averageOrderValue: Math.round(user.averagePrice * 100) / 100,
    totalSpent: Math.round(user.totalSpent * 100) / 100,
    averageRounds: Math.round((user.totalRounds / user.dealCount) * 100) / 100,
    lastDeal: user.lastDeal,
  }));

  successResponse(
    res,
    200,
    {
      leaderboard,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      timeframe,
      sortBy,
    },
    'Global leaderboard retrieved'
  );
});

/**
 * Get current user's statistics and ranking
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
    successResponse(
      res,
      200,
      {
        user: {
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
        },
        stats: {
          totalNegotiations: 0,
          bestDeal: null,
          averageDiscount: 0,
          totalSavings: 0,
          averageOrderValue: 0,
          averageRounds: 0,
          totalSpent: 0,
        },
        rank: null,
        recentNegotiations: [],
      },
      'User statistics retrieved'
    );
    return;
  }

  const totalSavings = entries.reduce((sum, e) => sum + e.discount, 0);
  const totalSpent = entries.reduce((sum, e) => sum + e.finalPrice, 0);
  const averageRounds = entries.reduce((sum, e) => sum + e.roundsUsed, 0) / entries.length;
  const averageDiscount = entries.reduce((sum, e) => sum + e.discountPercentage, 0) / entries.length;
  const bestDeal = Math.min(...entries.map((e) => e.finalPrice));

  // Get user's rank
  const userRank = await Leaderboard.aggregate([
    {
      $group: {
        _id: '$userId',
        totalSavings: { $sum: '$discount' },
      },
    },
    { $sort: { totalSavings: -1 } },
    { $group: { _id: null, users: { $push: '$_id' } } },
    { $project: { rank: { $indexOfArray: ['$users', req.userId] } } },
  ]);

  const rank = userRank[0]?.rank ? userRank[0].rank + 1 : null;

  const recentNegotiations = entries.slice(0, 10).map((e) => ({
    productName: e.productName,
    finalPrice: Math.round(e.finalPrice * 100) / 100,
    initialPrice: Math.round(e.initialPrice * 100) / 100,
    discount: Math.round(e.discount * 100) / 100,
    discountPercentage: Math.round(e.discountPercentage * 100) / 100,
    roundsUsed: e.roundsUsed,
    completedAt: e.completedAt,
  }));

  successResponse(
    res,
    200,
    {
      user: {
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      stats: {
        totalNegotiations: entries.length,
        bestDeal: Math.round(bestDeal * 100) / 100,
        averageDiscount: Math.round(averageDiscount * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        averageOrderValue: Math.round((totalSpent / entries.length) * 100) / 100,
        averageRounds: Math.round(averageRounds * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
      },
      rank,
      recentNegotiations,
    },
    'User statistics retrieved'
  );
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

/**
 * Manual cleanup endpoint to remove duplicate leaderboard entries
 * POST /api/leaderboard/admin/cleanup
 * This is called automatically by getLeaderboard but can be called manually if needed
 */
export const cleanupLeaderboard = asyncHandler(async (req, res) => {
  const result = await cleanupDuplicateLeaderboardEntries();

  successResponse(res, 200, result, 'Leaderboard cleanup completed');
});

/**
 * Debug endpoint - Get diagnostic info about leaderboard
 * GET /api/leaderboard/admin/debug
 */
export const debugLeaderboard = asyncHandler(async (req, res) => {
  try {
    // Count total entries
    const totalCount = await Leaderboard.countDocuments();
    
    // Get latest 10 entries
    const latestEntries = await Leaderboard.find()
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(10)
      .lean();

    // Get unique users
    const uniqueUsers = await Leaderboard.distinct('userId');
    
    // Get entries by user count
    const entriesByUser = await Leaderboard.aggregate([
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    successResponse(res, 200, {
      totalEntries: totalCount,
      uniqueUsers: uniqueUsers.length,
      latestEntries: latestEntries.map((e) => ({
        id: e._id,
        userId: e.userId,
        username: e.username,
        productName: e.productName,
        finalPrice: e.finalPrice,
        discount: e.discount,
        completedAt: e.completedAt,
        createdAt: e.createdAt,
      })),
      entriesByUser,
    }, 'Leaderboard diagnostic data');
  } catch (error) {
    successResponse(res, 200, {
      error: error.message,
      totalEntries: 0,
    }, 'Error retrieving diagnostic data');
  }
});
