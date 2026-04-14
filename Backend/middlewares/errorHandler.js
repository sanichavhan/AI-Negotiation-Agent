import { AppError } from '../utils/errorHandler.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = `Invalid input data: ${Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')}`;
    return res.status(400).json({
      success: false,
      error: {
        message,
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    return res.status(400).json({
      success: false,
      error: {
        message,
      },
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid token`;
    return res.status(401).json({
      success: false,
      error: {
        message,
      },
    });
  }

  // Default error response
  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
  });
};
