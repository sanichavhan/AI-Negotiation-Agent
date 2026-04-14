import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Verify JWT and attach user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(error.statusCode || 401).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = user._id;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};
