import { AppError } from '../utils/errorHandler.js';

/**
 * Validate required fields in request body
 */
export const validateRequired = (fields) => {
  return (req, res, next) => {
    try {
      const missing = [];

      fields.forEach((field) => {
        if (!req.body[field]) {
          missing.push(field);
        }
      });

      if (missing.length > 0) {
        throw new AppError(
          `Missing required fields: ${missing.join(', ')}`,
          400
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (req.body.email && !emailRegex.test(req.body.email)) {
      throw new AppError('Invalid email format', 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate price fields
 */
export const validatePrice = (field = 'price') => {
  return (req, res, next) => {
    try {
      if (req.body[field] && (isNaN(req.body[field]) || req.body[field] <= 0)) {
        throw new AppError(`${field} must be a positive number`, 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
