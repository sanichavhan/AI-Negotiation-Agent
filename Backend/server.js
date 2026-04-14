import dotenv from 'dotenv';

// Load env variables FIRST
dotenv.config();

import connectDB from './config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Wrap in async function
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();

export default app;