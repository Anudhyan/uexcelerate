#!/bin/bash

echo "🚀 Task Manager - Startup Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -d "/workspaces/uexcelerate/backend" ]; then
  echo "❌ Error: Run this from /workspaces/uexcelerate"
  exit 1
fi

# Step 1: Check PostgreSQL
echo "1️⃣ Checking PostgreSQL..."
if docker ps | grep -q postgres-taskmanager; then
  echo "   ✅ PostgreSQL container is running"
else
  echo "   ⚠️  PostgreSQL container not running"
  echo "   Starting PostgreSQL..."
  
  # Try to start existing container
  if docker start postgres-taskmanager 2>/dev/null; then
    echo "   ✅ Started existing container"
  else
    # Create new container
    echo "   Creating new PostgreSQL container..."
    docker run -d \
      --name postgres-taskmanager \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=taskmanagement \
      -p 5433:5432 \
      postgres:15-alpine
    
    if [ $? -eq 0 ]; then
      echo "   ✅ PostgreSQL container created"
    else
      echo "   ❌ Failed to create PostgreSQL container"
      exit 1
    fi
  fi
  
  echo "   Waiting for PostgreSQL to be ready..."
  sleep 5
fi

echo ""

# Step 2: Check backend dependencies
echo "2️⃣ Checking backend dependencies..."
cd /workspaces/uexcelerate/backend
if [ ! -d "node_modules" ]; then
  echo "   Installing backend dependencies..."
  npm install
else
  echo "   ✅ Backend dependencies installed"
fi

echo ""

# Step 3: Check database setup
echo "3️⃣ Checking database setup..."
if docker exec postgres-taskmanager psql -U postgres -d taskmanagement -c "\dt" 2>/dev/null | grep -q tasks; then
  echo "   ✅ Database tables exist"
else
  echo "   Setting up database tables..."
  npm run db:setup
fi

echo ""

# Step 4: Test connection
echo "4️⃣ Testing connections..."
node test-connection.js

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd /workspaces/uexcelerate/backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd /workspaces/uexcelerate/frontend"
echo "  npm start"
echo ""
