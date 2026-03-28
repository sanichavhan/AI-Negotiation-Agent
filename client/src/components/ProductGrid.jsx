/**
 * ProductGrid Component
 * Reusable grid layout for displaying multiple product cards
 * 
 * Props:
 * - products: Array of products
 * - onProductSelect: Callback when product is selected
 * - isLoading: Boolean for loading state
 * - error: Error message if any
 * - columns: Number of columns (default 3, responsive)
 * - showEmpty: Boolean to show empty state
 */

import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products = [],
  onProductSelect,
  isLoading = false,
  error = null,
  columns = 3,
  showEmpty = true,
  title = 'Products',
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold mb-2">❌ Error Loading Products</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0 && showEmpty) {
    return (
      <div className="w-full py-12 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">📦 No products available</p>
          <p className="text-gray-500 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
      )}

      {/* Grid Container */}
      <div
        className={`
          grid gap-4 sm:gap-6
          ${columns === 1 ? 'grid-cols-1' : ''}
          ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
          ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
          ${columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''}
          ${columns === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : ''}
        `}
      >
        {products.map((product) => (
          <div key={product.id} className="flex w-full">
            <ProductCard
              product={product}
              onSelect={onProductSelect}
              variant="default"
              showRating={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
