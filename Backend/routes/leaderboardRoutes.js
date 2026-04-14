import express from 'express';
import {
  getLeaderboard,
  getUserStats,
  getUserPersonalLeaderboard,
  getProductLeaderboard,
  cleanupLeaderboard,
  debugLeaderboard,
} from '../controllers/leaderboardController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * Get global leaderboard (public)
 * GET /api/leaderboard?page=1&limit=50
 */
router.get('/', optionalAuthMiddleware, asyncHandler(getLeaderboard));

/**
 * Get current user's statistics (MUST come before parameterized routes)
 * GET /api/leaderboard/stats
 */
router.get('/stats', authMiddleware, asyncHandler(getUserStats));

/**
 * Get user's personal best deals (MUST come before parameterized routes)
 * GET /api/leaderboard/personal
 */
router.get('/personal', authMiddleware, asyncHandler(getUserPersonalLeaderboard));

/**
 * Get leaderboard for specific product
 * GET /api/leaderboard/product/:productId
 */
router.get('/product/:productId', asyncHandler(getProductLeaderboard));

/**
 * Manual cleanup for duplicate leaderboard entries
 * POST /api/leaderboard/admin/cleanup
 * Removes old duplicate entries from database
 */
router.post('/admin/cleanup', asyncHandler(cleanupLeaderboard));

/**
 * Debug endpoint - diagnostic info
 * GET /api/leaderboard/admin/debug
 */
router.get('/admin/debug', asyncHandler(debugLeaderboard));

export default router;
