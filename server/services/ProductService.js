import axios from 'axios';

/**
 * ProductService - Handles all product-related operations
 * Integrates with FakeStore API for product data
 */

const FAKESTORE_API = 'https://fakestoreapi.com/products';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

let productCache = {
  data: null,
  timestamp: null,
};

class ProductService {
  /**
   * Fetch all products from FakeStore API
   * Caches results for 1 hour
   */
  static async getAllProducts() {
    try {
      // Check if cache is valid
      if (this._isCacheValid()) {
        console.log('📦 Returning cached products');
        return productCache.data;
      }

      console.log('🔄 Fetching fresh products from FakeStore API...');
      const response = await axios.get(FAKESTORE_API, {
        timeout: 10000, // 10 second timeout
      });

      // Cache the results
      productCache.data = response.data;
      productCache.timestamp = Date.now();

      console.log(`✅ Fetched ${response.data.length} products`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching products from FakeStore:', error.message);
      // Return cached data even if expired
      if (productCache.data) {
        console.log('📦 Returning expired cache due to API error');
        return productCache.data;
      }
      throw new Error('Failed to fetch products and no cache available');
    }
  }

  /**
   * Get category by filtering
   * FakeStore categories: electronics, jewelery, men's clothing, women's clothing
   */
  static async getProductsByCategory(category) {
    try {
      const allProducts = await this.getAllProducts();
      const filtered = allProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      return filtered;
    } catch (error) {
      console.error(`Error fetching ${category} products:`, error.message);
      throw error;
    }
  }

  /**
   * Get random products from a category
   */
  static async getRandomProductsByCategory(category, count = 6) {
    try {
      const products = await this.getProductsByCategory(category);
      return this._getRandomItems(products, count);
    } catch (error) {
      console.error(`Error getting random ${category} products:`, error.message);
      throw error;
    }
  }

  /**
   * Get random clothing products (mens + womens combined)
   */
  static async getRandomClothingProducts(count = 6) {
    try {
      const menProducts = await this.getProductsByCategory("men's clothing");
      const womenProducts = await this.getProductsByCategory("women's clothing");
      const combined = [...menProducts, ...womenProducts];
      const randomProducts = this._getRandomItems(combined, count);
      return randomProducts;
    } catch (error) {
      console.error('Error getting random clothing products:', error.message);
      throw error;
    }
  }

  /**
   * Get available clothing categories
   */
  static async getClothingCategories() {
    try {
      const allProducts = await this.getAllProducts();
      const categories = [...new Set(allProducts.map((p) => p.category))].filter(
        (cat) => cat.toLowerCase().includes('clothing')
      );
      return categories;
    } catch (error) {
      console.error('Error getting clothing categories:', error.message);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(productId) {
    try {
      const allProducts = await this.getAllProducts();
      const product = allProducts.find((p) => p.id === parseInt(productId));
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      return product;
    } catch (error) {
      console.error(`Error getting product ${productId}:`, error.message);
      throw error;
    }
  }

  /**
   * Clear the cache (for manual refresh)
   */
  static clearCache() {
    productCache = { data: null, timestamp: null };
    console.log('✅ Product cache cleared');
  }

  /**
   * Check if cache is still valid
   */
  static _isCacheValid() {
    if (!productCache.data || !productCache.timestamp) {
      return false;
    }
    const ageInMs = Date.now() - productCache.timestamp;
    return ageInMs < CACHE_DURATION;
  }

  /**
   * Get random items from array
   */
  static _getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }
}

export default ProductService;
