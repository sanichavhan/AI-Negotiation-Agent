import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateEmail } from '../middlewares/validation.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// Public routes
router.post('/register', validateEmail, asyncHandler(register));
router.post('/login', asyncHandler(login));

// Protected routes
router.get('/me', authMiddleware, asyncHandler(getProfile)); // Get current user details
router.get('/profile', authMiddleware, asyncHandler(getProfile));
router.put('/profile', authMiddleware, asyncHandler(updateProfile));
router.post('/change-password', authMiddleware, asyncHandler(changePassword));

export default router;
