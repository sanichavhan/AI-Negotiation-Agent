import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NegotiationSession',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userOffer: {
      type: Number,
      default: null,
    },
    aiCounterPrice: {
      type: Number,
      default: null,
    },
    aiReasoning: {
      type: String,
      default: null,
    },
    roundNumber: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
