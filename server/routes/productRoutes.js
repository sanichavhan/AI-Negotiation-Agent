import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
} from '../controllers/productController.js';
import { optionalAuthMiddleware } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * Get all products
 * GET /api/products?difficulty=medium&category=Electronics
 */
router.get('/', optionalAuthMiddleware, asyncHandler(getProducts));

/**
 * Get product by ID
 * GET /api/products/:id
 */
router.get('/:id', optionalAuthMiddleware, asyncHandler(getProductById));

/**
 * Create new product (admin only)
 * POST /api/products
 */
router.post('/', asyncHandler(createProduct));

export default router;
