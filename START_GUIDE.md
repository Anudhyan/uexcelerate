# Quick Start Guide - Task Management Application

## Current Status Check

Run these commands to verify your setup:

```bash
# 1. Check PostgreSQL container
docker ps | grep postgres-taskmanager

# 2. Check backend is running
lsof -i :5000

# 3. Check frontend is running
lsof -i :3000

# 4. Test backend API
curl http://localhost:5000/api/tasks
```

## Complete Startup Instructions

### Terminal 1: Start Backend

```bash
# Navigate to backend
cd /workspaces/uexcelerate/backend

# Start backend server (PostgreSQL container should already be running)
npm run dev
```

**Expected output:**
```
Server is running on port 5000
✅ Connected to PostgreSQL database
Database time: 2026-01-06T...
```

**Keep this terminal open!**

### Terminal 2: Start Frontend

Open a NEW terminal and run:

```bash
# Navigate to frontend
cd /workspaces/uexcelerate/frontend

# Start frontend server
npm start
```

The app will open at http://localhost:3000

## If Backend Shows Connection Error

If you see `❌ Failed to connect to PostgreSQL database`:

```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# If not running, start it
docker start postgres-taskmanager

# If container doesn't exist, create it
docker run -d \
  --name postgres-taskmanager \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskmanagement \
  -p 5433:5432 \
  postgres:15-alpine

# Wait 5 seconds, then restart backend
sleep 5
cd /workspaces/uexcelerate/backend
npm run dev
```

## If Frontend Shows "Disconnected" or "Failed to Fetch"

### Step 1: Verify Backend is Running

In backend terminal, you should see:
```
Server is running on port 5000
✅ Connected to PostgreSQL database
```

If not, follow "If Backend Shows Connection Error" above.

### Step 2: Test Backend Manually

```bash
# This should return [] or list of tasks
curl http://localhost:5000/api/tasks

# This should return server info
curl http://localhost:5000/
```

### Step 3: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - `net::ERR_CONNECTION_REFUSED` → Backend not running
   - `CORS error` → Backend CORS misconfigured
   - `Failed to fetch` → Wrong API URL

### Step 4: Verify .env Configuration

Your backend/.env should be:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=taskmanagement
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:3000
```

## Complete Reset (If Nothing Works)

```bash
# Stop everything
docker stop postgres-taskmanager
# Press Ctrl+C in both terminals

# Clean restart
docker start postgres-taskmanager
sleep 5

# Terminal 1
cd /workspaces/uexcelerate/backend
npm run dev

# Terminal 2 (new terminal)
cd /workspaces/uexcelerate/frontend
npm start
```

## Verification Checklist

- [ ] PostgreSQL container running: `docker ps | grep postgres`
- [ ] Backend running: Check Terminal 1 shows "Server is running on port 5000"
- [ ] Database connected: Check Terminal 1 shows "✅ Connected to PostgreSQL"
- [ ] API responding: `curl http://localhost:5000/api/tasks` returns data
- [ ] Frontend running: Browser opened to http://localhost:3000
- [ ] WebSocket connected: Look for "● Connected" (green) in UI header

## Common Port Issues

If you see "address already in use":

```bash
# Check what's using the port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL

# Kill the process using the port (replace PID)
kill -9 <PID>
```

## Success Indicators

When everything is working:

1. **Backend Terminal**: Shows "Server is running" and "Connected to PostgreSQL"
2. **Frontend Terminal**: Shows "Compiled successfully!"
3. **Browser**: Shows green "● Connected" status
4. **Functionality**: Can create, update, and delete tasks
5. **Real-time**: Changes appear instantly in multiple browser windows
