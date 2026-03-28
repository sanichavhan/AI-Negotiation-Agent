import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    initialPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['electronics', 'furniture', 'vehicles', 'jewelry', 'art', 'collectibles'],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    sellerInfo: {
      position: String,
      backstory: String,
      motivation: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for product queries
productSchema.index({ category: 1, difficulty: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
