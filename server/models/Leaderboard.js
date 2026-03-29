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

// Indexes for leaderboard queries
leaderboardSchema.index({ score: 1, createdAt: -1 });
// Unique index on sessionId to prevent duplicate entries
leaderboardSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Leaderboard', leaderboardSchema);
