/**
 * ClothingShowcase Component
 * Displays available clothing products in a grid
 * Users can select a product to start negotiation
 */

import React, { useEffect } from 'react';
import ProductGrid from './ProductGrid';
import useProducts from '../hooks/useProductsHook';

const ClothingShowcase = ({ onProductSelect }) => {
  const {
    products,
    loading,
    error,
    fetchClothingProducts,
    clearProducts,
  } = useProducts();

  // Fetch products on mount
  useEffect(() => {
    fetchClothingProducts(6);
    return () => {
      clearProducts();
    };
  }, []);

  const handleProductSelect = (product) => {
    console.log('Product selected:', product);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleRefresh = () => {
    fetchClothingProducts(6);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            👕 Clothing Store
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Select a product and negotiate with our AI seller for the best price!
          </p>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="
              inline-flex items-center gap-2
              bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400
              text-white font-semibold py-2 px-6 rounded-lg
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Loading...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh Products
              </>
            )}
          </button>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          onProductSelect={handleProductSelect}
          isLoading={loading}
          error={error}
          columns={3}
          title="Available Products for Negotiation"
          showEmpty={true}
        />

        {/* Info Box */}
        {!loading && products.length > 0 && (
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How it works:</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✅ Click "Start Negotiation" on any product</li>
              <li>✅ Chat with our AI seller to negotiate the price</li>
              <li>✅ The AI will offer discounts from 10% up to 25%</li>
              <li>✅ Accept the deal when you're satisfied</li>
              <li>✅ Track your purchases in your profile</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingShowcase;
