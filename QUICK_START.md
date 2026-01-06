# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Quick Start (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# Update: DB_USER, DB_PASSWORD
```

### 3. Setup Database
```bash
npm run db:setup
```

### 4. Start Backend
```bash
npm run dev
```
Backend runs on: http://localhost:5000

### 5. Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### 6. Start Frontend
```bash
npm start
```
Frontend runs on: http://localhost:3000

## Verify Installation

1. Open http://localhost:3000
2. You should see "Connected" status (green badge)
3. Create a test task
4. Open another browser window at http://localhost:3000
5. Verify real-time updates work

## Common Issues

**Database connection error:**
- Ensure PostgreSQL is running
- Verify credentials in backend/.env

**Port already in use:**
- Change PORT in backend/.env
- Update proxy in frontend/package.json

**WebSocket not connecting:**
- Check backend is running
- Verify CORS settings

## Features to Test

✅ Create task with title and description
✅ Filter tasks by status (All/Pending/In Progress/Completed)
✅ Update task status via dropdown
✅ Delete task (with confirmation)
✅ Real-time updates (open in multiple windows)
✅ Responsive design (resize browser window)

## Project Structure

```
uexcelerate/
├── backend/          # Express API + Socket.io
├── frontend/         # React application
├── README.md         # Comprehensive documentation
├── PROJECT_DOCUMENTATION.md  # Detailed architecture
└── UI_DESIGN_MOCKUP.html     # Visual design reference
```

## Need Help?

- Full documentation: See README.md
- Architecture details: See PROJECT_DOCUMENTATION.md
- UI Design: Open UI_DESIGN_MOCKUP.html in browser

## API Testing

Test endpoints with curl:

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "Testing API"}'

# Filter by status
curl http://localhost:5000/api/tasks?status=pending

# Update status
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/1
```

Happy coding! 🚀
