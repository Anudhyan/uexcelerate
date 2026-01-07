// Import PostgreSQL pool for connection management
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to the PostgreSQL database
// Using a pool instead of single connections improves performance by reusing connections
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the database connection on startup to ensure configuration is correct
// This helps catch configuration errors early
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL database:', err.message);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Listen for unexpected errors in the pool and log them
// This helps identify problems with database connections during runtime
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Export the pool so other modules can query the database
module.exports = pool;
