const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize database connection
require('./config/database');

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Trust proxy - important for Codespaces
app.set('trust proxy', 1);

const server = http.createServer(app);

const isAllowedOrigin = (origin) => {
  // Allow non-browser clients (curl, server-to-server)
  if (!origin) return true;

  // Local dev
  if (
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:3001' ||
    origin === 'http://127.0.0.1:3000' ||
    origin === 'http://127.0.0.1:3001'
  ) {
    return true;
  }

  // Codespaces forwarded ports
  if (/^https:\/\/.*-\d+\.app\.github\.dev$/.test(origin)) {
    return true;
  }

  return false;
};

const corsOrigin = (origin, callback) => {
  callback(null, isAllowedOrigin(origin));
};

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Root endpoint
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
