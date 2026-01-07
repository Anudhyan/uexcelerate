// Import required dependencies
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize database connection - this tests if the database is accessible
require('./config/database');

// Import task routes
const taskRoutes = require('./routes/taskRoutes');

// Create Express application
const app = express();

// Trust proxy setting for production environments like Codespaces
// This ensures we get the correct client IP address behind a proxy
app.set('trust proxy', 1);

// Create HTTP server that will wrap the Express app
// This is needed to support WebSocket through Socket.io
const server = http.createServer(app);

// CORS (Cross-Origin Resource Sharing) helper function
// Validates that requests come from allowed origins to prevent unauthorized access
const isAllowedOrigin = (origin) => {
  // Allow non-browser clients like curl and server-to-server requests
  if (!origin) return true;

  // Allow local development on standard ports
  if (
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:3001' ||
    origin === 'http://127.0.0.1:3000' ||
    origin === 'http://127.0.0.1:3001'
  ) {
    return true;
  }

  // Allow GitHub Codespaces forwarded ports which have a special URL pattern
  if (/^https:\/\/.*-\d+\.app\.github\.dev$/.test(origin)) {
    return true;
  }

  // Reject all other origins
  return false;
};

// CORS callback function that determines allowed origins
const corsOrigin = (origin, callback) => {
  callback(null, isAllowedOrigin(origin));
};

// Initialize Socket.io server with CORS configuration
// This enables real-time bidirectional communication between server and clients
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Middleware Stack
// Enable CORS for cross-origin requests from allowed origins
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Make Socket.io instance accessible to route handlers
// This allows task routes to emit real-time events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Task API routes
app.use('/api/tasks', taskRoutes);

// Root endpoint - provides API information
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API with Real-time Updates',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

// Error handling middleware
// Catches any errors thrown by route handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Not Found handler
// Responds when a request doesn't match any route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// WebSocket connection handling
// Logs when clients connect and disconnect
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Log when a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

// Listen on all network interfaces (0.0.0.0) to accept connections from any IP
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
