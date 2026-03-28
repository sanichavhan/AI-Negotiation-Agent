import express from 'express';
import {
  getProducts,
  getProductById,
  getAvailableClothing,
  getByCategory,
  getCategories,
  refreshCache,
} from '../controllers/productController.js';
import { optionalAuthMiddleware } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * Get all available categories (SPECIFIC - comes first)
 * GET /api/products/categories
 */
router.get('/categories', optionalAuthMiddleware, asyncHandler(getCategories));

/**
 * Get random available clothing products (SPECIFIC - comes first)
 * GET /api/products/available/clothing?count=6
 */
router.get('/available/clothing', optionalAuthMiddleware, asyncHandler(getAvailableClothing));

/**
 * Refresh product cache (SPECIFIC - comes first)
 * GET /api/products/admin/refresh
 */
router.get('/admin/refresh', asyncHandler(refreshCache));

/**
 * Get products by category (SPECIFIC with params)
 * GET /api/products/category/:category?count=12
 */
router.get('/category/:category', optionalAuthMiddleware, asyncHandler(getByCategory));

/**
 * Get all products from FakeStore API (CATCH-ALL - comes after specific routes)
 * GET /api/products
 */
router.get('/', optionalAuthMiddleware, asyncHandler(getProducts));

/**
 * Get product by ID (PARAMETERIZED - MUST come last)
 * GET /api/products/:id
 */
router.get('/:id', optionalAuthMiddleware, asyncHandler(getProductById));

export default router;
