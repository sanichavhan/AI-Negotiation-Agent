import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
    userEmail: String,
    productName: String,
    initialPrice: Number,
    finalPrice: Number,
    discount: Number,
    discountPercentage: Number,
    roundsUsed: Number,
    score: Number, // Lower is better (finalPrice - discount)
    completedAt: Date,
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NegotiationSession',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for quick leaderboard queries
leaderboardSchema.index({ score: 1, createdAt: -1 });

export default mongoose.model('Leaderboard', leaderboardSchema);
