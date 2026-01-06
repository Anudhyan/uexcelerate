#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');
const http = require('http');

console.log('🔍 Testing Backend Connection...\n');

// Test 1: Check environment variables
console.log('1️⃣ Environment Configuration:');
console.log('   PORT:', process.env.PORT || '5000');
console.log('   DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('   DB_PORT:', process.env.DB_PORT || '5432');
console.log('   DB_NAME:', process.env.DB_NAME || 'taskmanagement');
console.log('   DB_USER:', process.env.DB_USER || 'postgres');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('');

// Test 2: PostgreSQL connection
console.log('2️⃣ Testing PostgreSQL Connection...');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taskmanagement',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.query('SELECT NOW() as time, version() as version', (err, res) => {
  if (err) {
    console.log('   ❌ Database Connection FAILED');
    console.log('   Error:', err.message);
    console.log('');
    console.log('   💡 Solution:');
    console.log('   1. Check PostgreSQL is running: docker ps | grep postgres');
    console.log('   2. If not running: docker start postgres-taskmanager');
    console.log('   3. Verify DB_PORT in .env matches container port (5433)');
    console.log('');
    pool.end();
    process.exit(1);
  } else {
    console.log('   ✅ Database Connection SUCCESS');
    console.log('   Server time:', res.rows[0].time);
    console.log('   PostgreSQL:', res.rows[0].version.split(' ')[0], res.rows[0].version.split(' ')[1]);
    console.log('');
    
    // Test 3: Check tasks table
    console.log('3️⃣ Testing Tasks Table...');
    pool.query('SELECT COUNT(*) as count FROM tasks', (err2, res2) => {
      if (err2) {
        console.log('   ⚠️  Tasks table not found');
        console.log('   Run: npm run db:setup');
        console.log('');
      } else {
        console.log('   ✅ Tasks table exists');
        console.log('   Current tasks:', res2.rows[0].count);
        console.log('');
      }
      
      pool.end();
      
      // Test 4: Check if backend is running
      console.log('4️⃣ Testing Backend Server...');
      const options = {
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path: '/api/tasks',
        method: 'GET',
        timeout: 3000,
      };
      
      const req = http.request(options, (response) => {
        console.log('   ✅ Backend Server is RUNNING');
        console.log('   Status Code:', response.statusCode);
        console.log('');
        console.log('🎉 All systems operational!');
        console.log('');
        console.log('Next steps:');
        console.log('  • Frontend: cd /workspaces/uexcelerate/frontend && npm start');
        console.log('  • Open browser: http://localhost:3000');
      });
      
      req.on('error', (e) => {
        console.log('   ❌ Backend Server is NOT running');
        console.log('   Error:', e.message);
        console.log('');
        console.log('   💡 Solution:');
        console.log('   Start backend: cd /workspaces/uexcelerate/backend && npm run dev');
      });
      
      req.on('timeout', () => {
        console.log('   ❌ Backend Server timeout');
        req.destroy();
      });
      
      req.end();
    });
  }
});
