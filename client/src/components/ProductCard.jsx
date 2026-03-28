/**
 * ProductCard Component
 * Reusable card component for displaying product information
 * 
 * Props:
 * - product: { id, title, price, image, category, rating, description }
 * - onSelect: Function to call when product is selected
 * - onClick: Function to call when card is clicked
 * - variant: 'default' | 'compact' | 'expanded'
 * - showRating: Boolean to show rating
 */

import React from 'react';

const ProductCard = ({
  product,
  onSelect,
  onClick,
  variant = 'default',
  showRating = true,
}) => {
  if (!product) return null;

  const { id, title, price, image, category, rating = {} } = product;

  // Truncate title if too long
  const displayTitle = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300
        overflow-hidden cursor-pointer h-full flex flex-col w-full
      `}
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative bg-gray-100 overflow-hidden h-48 sm:h-56 flex items-center justify-center">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
          {category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {displayTitle}
        </h3>

        {/* Rating (if show rating is true) */}
        {showRating && rating.rate && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating.rate) ? '⭐' : '☆'}>
                  {i < Math.round(rating.rate) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              ({rating.count || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-green-600">${price.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Original Price</p>
        </div>

        {/* Discount Info */}
        <div className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          <p className="text-xs text-red-700 font-semibold">
            💰 Negotiate for 10-25% OFF
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          className="
            w-full mt-auto bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700
            text-white font-semibold py-2 px-4 rounded-lg
            transition-all duration-300 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          🤝 Start Negotiation
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
