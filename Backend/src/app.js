import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from '../middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from '../routes/authRoutes.js';
import negotiationRoutes from '../routes/negotiationRoutes.js';
import leaderboardRoutes from '../routes/leaderboardRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import morgan from 'morgan';
const app = express();

// CORS configuration - Read from environment variables
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean); // Remove falsy values

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
