/**
 * Custom Hook: useProducts
 * Handles all product fetching and state management
 * 
 * Usage:
 * const { products, loading, error, fetchProducts } = useProducts();
 */

import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all products
   */
  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error('Error fetching products:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch available clothing products
   */
  const fetchClothingProducts = async (count = 6) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/products/available/clothing', {
        params: { count },
      });
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch clothing products');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error('Error fetching clothing products:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch products by category
   */
  const fetchByCategory = async (category, count = 6) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/products/category/${category}`, {
        params: { count },
      });
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error(`Error fetching ${category} products:`, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch single product by ID
   */
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/products/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch product');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch product';
      setError(errorMsg);
      console.error('Error fetching product:', errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/products/categories');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      return [];
    }
  };

  /**
   * Clear products and error
   */
  const clearProducts = () => {
    setProducts([]);
    setError(null);
  };

  return {
    // State
    products,
    loading,
    error,

    // Methods
    fetchAllProducts,
    fetchClothingProducts,
    fetchByCategory,
    fetchProductById,
    fetchCategories,
    clearProducts,
  };
};

export default useProducts;
