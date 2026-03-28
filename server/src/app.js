import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from '../middlewares/errorHandler.js';

// Import routes
import authRoutes from '../routes/authRoutes.js';
import negotiationRoutes from '../routes/negotiationRoutes.js';
import leaderboardRoutes from '../routes/leaderboardRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import morgan from 'morgan';
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
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
