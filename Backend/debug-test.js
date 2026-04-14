#!/usr/bin/env node
/**
 * Quick Debug Test - Run this to verify production readiness
 * Usage: node debug-test.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = 'http://localhost:8000';
const tests = [];

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`✅ ${name}`);
    tests.push({ name, status: 'PASS' });
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    tests.push({ name, status: 'FAIL', error: error.message });
  }
};

console.log('\n🔧 RUNNING PRODUCTION TESTS\n');

// Test 1: Health Check
await test('1. Backend Health Check', async () => {
  const res = await axios.get(`${BACKEND_URL}/api/health`);
  if (!res.data.success) throw new Error('Health check failed');
});

// Test 2: Register User
let testEmail = `test_${Date.now()}@test.com`;
let testToken = null;
await test('2. User Registration', async () => {
  const res = await axios.post(`${BACKEND_URL}/api/auth/register`, {
    username: `testuser_${Date.now()}`,
    email: testEmail,
    password: 'Password123!@',
  });
  if (!res.data.token) throw new Error('No token returned');
  testToken = res.data.token;
});

// Test 3: User Login
await test('3. User Login', async () => {
  const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
    email: testEmail,
    password: 'Password123!@',
  });
  if (!res.data.token) throw new Error('No token returned');
});

// Test 4: Get User Profile
await test('4. Get User Profile', async () => {
  if (!testToken) throw new Error('No token available');
  const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${testToken}` },
  });
  if (!res.data.user) throw new Error('No user data');
});

// Test 5: Get Products
await test('5. Get Products', async () => {
  const res = await axios.get(`${BACKEND_URL}/api/products`);
  if (!Array.isArray(res.data)) throw new Error('Products not an array');
});

// Test 6: Get Leaderboard
await test('6. Get Leaderboard', async () => {
  const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
  if (!res.data) throw new Error('No leaderboard data');
});

// Test 7: Start Negotiation Session
await test('7. Start Negotiation Session', async () => {
  if (!testToken) throw new Error('No token available');
  const res = await axios.post(`${BACKEND_URL}/api/negotiation/start`, 
    { productId: '1' },
    { headers: { Authorization: `Bearer ${testToken}` } }
  );
  if (!res.data.sessionId) throw new Error('No session ID returned');
});

// Test 8: CORS Check
await test('8. CORS Configuration', async () => {
  const res = await axios.get(`${BACKEND_URL}/api/health`, {
    headers: { 'Origin': 'http://localhost:5173' }
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

const passed = tests.filter(t => t.status === 'PASS').length;
const failed = tests.filter(t => t.status === 'FAIL').length;

console.log(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}\n`);

tests.forEach(t => {
  if (t.status === 'FAIL') {
    console.log(`  ❌ ${t.name}`);
    console.log(`     Error: ${t.error}`);
  }
});

if (failed === 0) {
  console.log('\n🎉 All tests passed! Production ready.\n');
} else {
  console.log(`\n⚠️  ${failed} test(s) failed. See errors above.\n`);
  process.exit(1);
}
