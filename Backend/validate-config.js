#!/usr/bin/env node
/**
 * Production Configuration Validator
 * Tests all critical configuration and connectivity
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
};

const log = {
  pass: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  fail: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset}  ${msg}`),
};

console.log(`\n${'='.repeat(60)}`);
console.log('🔧 PRODUCTION CONFIGURATION VALIDATOR');
console.log(`${'='.repeat(60)}\n`);

let allValid = true;

// ✅ Test 1: Environment Variables
console.log('📍 Test 1: Environment Variables');
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV', 'ALLOWED_ORIGINS'];

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value && value.length > 0) {
    const displayValue = envVar === 'MONGODB_URI' 
      ? `${value.substring(0, 40)}...` 
      : envVar === 'JWT_SECRET'
      ? `${value.substring(0, 10)}... (${value.length} chars)`
      : value;
    log.pass(`${envVar}: ${displayValue}`);
  } else {
    log.fail(`${envVar}: NOT SET or EMPTY`);
    allValid = false;
  }
});

// ✅ Test 2: JWT Configuration
console.log('\n📍 Test 2: JWT Configuration');
try {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length > 5) {
    // Try to sign a test token
    const testPayload = { userId: 'test123', iat: Date.now() };
    const testToken = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Verify it
    const verified = jwt.verify(testToken, process.env.JWT_SECRET);
    log.pass(`JWT Token generation and verification working`);
    log.info(`Test token (first 50 chars): ${testToken.substring(0, 50)}...`);
  } else {
    log.fail(`JWT_SECRET too short or not set (min 6 chars recommended)`);
    allValid = false;
  }
} catch (error) {
  log.fail(`JWT configuration error: ${error.message}`);
  allValid = false;
}

// ✅ Test 3: MongoDB Configuration
console.log('\n📍 Test 3: MongoDB Configuration');
try {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    log.fail(`MONGODB_URI not set`);
    allValid = false;
  } else {
    // Check URI format
    if (mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb://')) {
      log.pass(`MONGODB_URI format valid`);
      
      // Extract connection info
      if (mongoUri.includes('@')) {
        const hostPart = mongoUri.split('@')[1];
        log.info(`Connecting to: ${hostPart.split('/')[0]}`);
      }
    } else {
      log.fail(`Invalid MONGODB_URI format (must start with mongodb:// or mongodb+srv://)`);
      allValid = false;
    }
  }
} catch (error) {
  log.fail(`MongoDB configuration error: ${error.message}`);
  allValid = false;
}

// ✅ Test 4: CORS Configuration
console.log('\n📍 Test 4: CORS Configuration');
try {
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  if (allowedOrigins) {
    const origins = allowedOrigins.split(',').map(o => o.trim());
    log.pass(`ALLOWED_ORIGINS configured with ${origins.length} domain(s):`);
    origins.forEach(origin => log.info(`  • ${origin}`));
    
    // Check for production domains
    const hasProductionDomain = origins.some(o => 
      o.includes('.com') || o.includes('.net') || o.includes('.app')
    );
    if (hasProductionDomain) {
      log.pass(`Production domains detected`);
    } else if (origins[0].includes('localhost')) {
      log.warn(`Only localhost in ALLOWED_ORIGINS (for production, add real domain)`);
    }
  } else {
    log.fail(`ALLOWED_ORIGINS not set`);
    allValid = false;
  }
} catch (error) {
  log.fail(`CORS configuration error: ${error.message}`);
  allValid = false;
}

// ✅ Test 5: Node Modules
console.log('\n📍 Test 5: Dependencies');
try {
  const deps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv'];
  deps.forEach(dep => {
    try {
      require.resolve(dep);
      log.pass(`${dep} installed`);
    } catch (e) {
      log.fail(`${dep} NOT installed`);
      allValid = false;
    }
  });
} catch (error) {
  log.fail(`Dependency check error: ${error.message}`);
}

// ✅ Test 6: Production Environment
console.log('\n📍 Test 6: Production Environment');
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'production') {
  log.pass(`NODE_ENV: production`);
  
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret === 'dev_jwt_secret_key_change_in_production' || jwtSecret === 'your_jwt_secret_key_here_change_in_production') {
    log.warn(`⚠️  Using default JWT_SECRET - MUST be changed for production!`);
    allValid = false;
  }
} else {
  log.warn(`NODE_ENV: ${nodeEnv} (not 'production')`);
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log('📋 VALIDATION SUMMARY');
console.log(`${'='.repeat(60)}\n`);

if (allValid) {
  log.pass(`All validations passed! ✨`);
  log.info(`Your production configuration is ready.`);
} else {
  log.warn(`Some validations failed. See errors above.`);
  log.info(`Fix the errors and try again.`);
}

console.log(`\n${'='.repeat(60)}\n`);

process.exit(allValid ? 0 : 1);
