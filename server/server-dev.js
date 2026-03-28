#!/usr/bin/env node

import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

console.log('\n🚀 Starting AI Negotiation Agent Server...\n');
console.log(`  Port: ${PORT}`);
console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`  Database: ${(process.env.MONGODB_URI || 'mongodb://localhost:27017').substring(0, 60)}...`);
console.log();

// Start server with proper error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connection successful\n');
    
    // Start server with error handling for port conflicts
    const server = app.listen(PORT, () => {
      console.log('🚀 Server running successfully!');
      console.log(`📍 API URL: http://localhost:${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
      console.log('\n✅ Ready to accept requests');
      console.log('   - Negotiation API at /api/negotiation');
      console.log('   - Authentication at /api/auth');
      console.log('   - Leaderboard at /api/leaderboard');
      console.log('   - Products at /api/products\n');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
        console.error('\nSolutions:');
        console.error('  1. Kill the process using port 3000:');
        console.error('     Windows: taskkill /PID <PID> /F');
        console.error('     Mac/Linux: kill -9 <PID>');
        console.error('  2. Or change PORT in .env file\n');
        process.exit(1);
      } else {
        console.error(`\n❌ Server error: ${error.message}`);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n📴 Shutting down server gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('\n❌ Failed to start server!\n');
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('🔴 MongoDB Connection Error:');
      console.error('   Cannot connect to MongoDB at the configured address');
      console.error('\nSolutions:');
      console.error('  1. If using local MongoDB:');
      console.error('     → Start MongoDB: mongod');
      console.error('  2. If using MongoDB Atlas (Cloud):');
      console.error('     → Check internet connection');
      console.error('     → Verify credentials in .env');
      console.error('     → Check IP whitelist at MongoDB Atlas dashboard');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔴 MongoDB Authentication Error:');
      console.error('   Invalid credentials in MONGODB_URI');
      console.error('   Check username and password in .env file');
    } else {
      console.error('Error:', error.message);
    }
    
    console.error('\n📖 For more details, run: node diagnose.js\n');
    process.exit(1);
  }
};

startServer();

export default app;
