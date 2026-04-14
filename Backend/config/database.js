import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Support both MONGODB_URI (legacy) and DB_URI (new standard)
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URI || 'mongodb://localhost:27017/ai-negotiation-game';
    
    console.log(`🔗 Attempting to connect to MongoDB...`);
    console.log(`   URI: ${mongoUri.split('@')[1] ? mongoUri.split('/').slice(0, 3).join('/') + '/**' : mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri, {
      retryWrites: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n📝 HOW TO FIX:\n`);
    console.error(`   Option 1: Use MongoDB Atlas (Cloud)`);
    console.error(`   - Sign up: https://www.mongodb.com/cloud/atlas`);
    console.error(`   - Get connection string`);
    console.error(`   - Update MONGODB_URI in your .env file\n`);
    console.error(`   Option 2: Install MongoDB Locally`);
    console.error(`   - Download: https://www.mongodb.com/try/download/community`);
    console.error(`   - Install and start MongoDB service\n`);
    console.error(`   Option 3: Use Docker`);
    console.error(`   - Run: docker run -d -p 27017:27017 --name mongodb mongo:latest\n`);
    process.exit(1);
  }
};

export default connectDB;
