#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 AI Negotiation Agent - Diagnostic Script\n');
console.log('=' .repeat(60));

// 1. Check Environment Variables
console.log('\n✅ Checking Environment Variables...');
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'MISTRAL_API_KEY'];
let envOK = true;

requiredEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    console.log(`  ✓ ${envVar}: Set`);
  } else {
    console.log(`  ✗ ${envVar}: MISSING`);
    envOK = false;
  }
});

// 2. Check .env file
console.log('\n✅ Checking .env File...');
const envFilePath = new URL('./.env', import.meta.url).pathname;
if (fs.existsSync(envFilePath)) {
  console.log(`  ✓ .env file exists`);
} else {
  console.log(`  ✗ .env file NOT FOUND`);
}

// 3. Check Node Modules
console.log('\n✅ Checking Dependencies...');
const nodeModulesPath = `${__dirname}/node_modules`;
if (fs.existsSync(nodeModulesPath)) {
  console.log(`  ✓ node_modules directory exists`);
  const criticalDeps = ['express', 'mongoose', 'jsonwebtoken', '@mistralai/mistralai'];
  criticalDeps.forEach((dep) => {
    const depPath = `${nodeModulesPath}/${dep}`;
    if (fs.existsSync(depPath)) {
      console.log(`    ✓ ${dep} installed`);
    } else {
      console.log(`    ✗ ${dep} NOT installed`);
    }
  });
} else {
  console.log(`  ✗ node_modules directory NOT found`);
  console.log(`    → Run: npm install`);
}

// 4. Test MongoDB Connection
console.log('\n✅ Testing MongoDB Connection...');
console.log(`  Connecting to: ${process.env.MONGODB_URI?.substring(0, 60)}...`);

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-negotiator-game', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`  ✓ MongoDB Connection SUCCESS`);
    console.log(`  ✓ Host: ${mongoose.connection.host}`);
    console.log(`  ✓ Database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
  } catch (error) {
    console.log(`  ✗ MongoDB Connection FAILED`);
    console.log(`  Error: ${error.message}`);
    if (error.message.includes('getaddrinfo')) {
      console.log(`  → Check: Internet connection or MongoDB Atlas credentials`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(`  → Check: MongoDB is running (mongod) or use MongoDB Atlas`);
    }
  }
};

await testConnection();

// 5. Check Port Availability
console.log('\n✅ Checking Port 3000...');
import net from 'net';

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, 'localhost');
  });
};

const portAvailable = await checkPort(3000);
if (portAvailable) {
  console.log(`  ✓ Port 3000 is available`);
} else {
  console.log(`  ✗ Port 3000 is already in use`);
  console.log(`  → Kill the process or change PORT in .env`);
}

// 6. Summary
console.log('\n' + '='.repeat(60));
console.log('\n📋 Summary:\n');

if (envOK && portAvailable) {
  console.log('  ✅ All checks passed! You can start the server with:');
  console.log('     node server.js\n');
} else {
  console.log('  ❌ Some checks failed. Fix the issues above before starting.\n');
  if (!envOK) {
    console.log('     → Copy .env.example to .env and update values');
  }
  if (!portAvailable) {
    console.log('     → Free port 3000 or change PORT in .env');
  }
}

console.log('='.repeat(60) + '\n');
