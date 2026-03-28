import Product from '../models/Product.js';
import { successResponse, asyncHandler, AppError } from '../utils/errorHandler.js';
import ProductService from '../services/ProductService.js';

/**
 * Get all products from FakeStore API
 */
export const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts();
  successResponse(res, 200, products, 'Products retrieved successfully');
});

/**
 * Get available clothing products (random 6-12)
 */
export const getAvailableClothing = asyncHandler(async (req, res) => {
  const count = req.query.count || 6;
  const products = await ProductService.getRandomClothingProducts(parseInt(count));
  successResponse(res, 200, products, 'Available clothing products');
});

/**
 * Get products by category
 */
export const getByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const count = req.query.count || 12;
  
  if (category.toLowerCase().includes('clothing')) {
    const products = await ProductService.getRandomClothingProducts(parseInt(count));
    successResponse(res, 200, products, `${category} products`);
  } else {
    const products = await ProductService.getRandomProductsByCategory(
      category,
      parseInt(count)
    );
    successResponse(res, 200, products, `${category} products`);
  }
});

/**
 * Get product by ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.getProductById(id);
  successResponse(res, 200, product, 'Product retrieved successfully');
});

/**
 * Get all available categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const allProducts = await ProductService.getAllProducts();
  const categories = [...new Set(allProducts.map((p) => p.category))];
  successResponse(res, 200, categories, 'Categories retrieved');
});

/**
 * Refresh product cache (admin endpoint)
 */
export const refreshCache = asyncHandler(async (req, res) => {
  ProductService.clearCache();
  const products = await ProductService.getAllProducts();
  successResponse(res, 200, { cached: products.length }, 'Cache refreshed');
});
