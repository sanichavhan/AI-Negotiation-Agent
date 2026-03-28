import Product from '../models/Product.js';
import { successResponse, asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * Get all available products
 * TODO: Implement product listing
 */
export const getProducts = asyncHandler(async (req, res) => {
  // 1. Query all products
  // 2. Apply filters if provided (difficulty, category)
  // 3. Sort by name
  // 4. Return products

  throw new AppError('Not yet implemented', 501);
});

/**
 * Get product details
 * TODO: Implement product details retrieval
 */
export const getProductById = asyncHandler(async (req, res) => {
  // 1. Get product by ID
  // 2. Include top leaderboard scores for this product
  // 3. Return product details

  throw new AppError('Not yet implemented', 501);
});

/**
 * Create new product (admin)
 * TODO: Implement product creation
 */
export const createProduct = asyncHandler(async (req, res) => {
  // 1. Validate admin status
  // 2. Validate product data
  // 3. Create product
  // 4. Return created product

  throw new AppError('Not yet implemented', 501);
});
