import dotenv from 'dotenv';

// Load environment variables FIRST before importing anything else
dotenv.config();

import connectDB from './config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// Start server only after DB connects
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server with error handling for port conflicts
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Ready to accept requests`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error(`❌ Server error:`, error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(`❌ Failed to start server:`, error.message);
    process.exit(1);
  }
};

startServer();

export default app;
