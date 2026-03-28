import express from 'express';
import {
  startSession,
  sendMessage,
  getSession,
  acceptDeal,
  abandonSession,
  getHistory,
} from '../controllers/negotiationController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Start a new negotiation session
 * POST /api/negotiation/start
 */
router.post('/start', asyncHandler(startSession));

/**
 * Send message to AI in active session
 * POST /api/negotiation/:sessionId/message
 */
router.post('/:sessionId/message', asyncHandler(sendMessage));

/**
 * Get session details
 * GET /api/negotiation/:sessionId
 */
router.get('/:sessionId', asyncHandler(getSession));

/**
 * Accept current deal
 * POST /api/negotiation/:sessionId/accept
 */
router.post('/:sessionId/accept', asyncHandler(acceptDeal));

/**
 * Abandon session
 * POST /api/negotiation/:sessionId/abandon
 */
router.post('/:sessionId/abandon', asyncHandler(abandonSession));

/**
 * Get user's negotiation history
 * GET /api/negotiation/history
 */
router.get('/history', asyncHandler(getHistory));

export default router;
