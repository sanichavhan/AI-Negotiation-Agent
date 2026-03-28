import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      // Can be MongoDB ObjectId or FakeStore API ID (number)
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    productName: String,
    initialPrice: Number,
    currentPrice: Number,
    minimumPrice: Number,
    targetProfit: Number,
    finalPrice: {
      type: Number,
      default: null,
    },
    roundNumber: {
      type: Number,
      default: 0,
    },
    maxRounds: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    sellerStrategy: {
      type: String,
      enum: ['aggressive', 'friendly', 'logical', 'psychological'],
      default: 'logical',
    },
    patienceLevel: {
      type: Number,
      default: 5, // 1-10 scale
    },
    discount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('NegotiationSession', sessionSchema);
