import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📝 API: http://localhost:${PORT}/api`);
});

export default app;
