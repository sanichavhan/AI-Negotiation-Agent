/**
 * Custom error handler class
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle async errors in route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Standard error response format
 */
export const errorResponse = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
    },
  });
};

/**
 * Standard success response format
 */
export const successResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
