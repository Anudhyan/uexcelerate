# Task Management Application with Real-time Updates

A full-stack task management system built with React, Node.js, Express, PostgreSQL, and Socket.io for real-time updates.

![Task Management App](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Socket.io](https://img.shields.io/badge/WebSocket-Socket.io-black)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Real-time Updates](#real-time-updates)
- [UI Features](#ui-features)
- [Architecture & Design Decisions](#architecture--design-decisions)

## ✨ Features

### Backend Features
- ✅ RESTful API with Express.js
- ✅ PostgreSQL database with proper schema design
- ✅ Full CRUD operations for tasks
- ✅ Status filtering (pending, in-progress, completed)
- ✅ Real-time updates using WebSocket (Socket.io)
- ✅ Input validation and error handling
- ✅ Appropriate HTTP status codes
- ✅ CORS enabled for cross-origin requests

### Frontend Features
- ✅ Task List Display with title, description, status, and creation date
- ✅ Status Filtering with interactive tabs (All/Pending/In Progress/Completed)
- ✅ Create Task Form with validation
- ✅ Status Updates via dropdown selector
- ✅ Delete Task with confirmation
- ✅ Color-coded Status Badges (Pending: Yellow, In Progress: Blue, Completed: Green)
- ✅ Responsive Layout (mobile-friendly design)
- ✅ Real-time updates with WebSocket listeners
- ✅ Optimistic UI updates for instant feedback
- ✅ Custom hooks for data fetching (useTasks, useSocket)

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Socket.io** - Real-time bidirectional communication
- **pg** - PostgreSQL client for Node.js
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI library
- **Socket.io-client** - WebSocket client
- **CSS3** - Styling with responsive design

## 📁 Project Structure

```
uexcelerate/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   └── taskController.js    # Task business logic and validation
│   ├── routes/
│   │   └── taskRoutes.js        # API route definitions
│   ├── scripts/
│   │   └── setupDatabase.js     # Database setup script
│   ├── database/
│   │   └── schema.sql           # SQL schema definition
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server with Socket.io
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskManager.js   # Main container component
│   │   │   ├── TaskManager.css
│   │   │   ├── TaskForm.js      # Create task form
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskFilters.js   # Status filter tabs
│   │   │   ├── TaskFilters.css
│   │   │   ├── TaskList.js      # Task list renderer
│   │   │   ├── TaskList.css
│   │   │   ├── TaskItem.js      # Individual task card
│   │   │   └── TaskItem.css
│   │   ├── hooks/
│   │   │   ├── useTasks.js      # Custom hook for task operations
│   │   │   └── useSocket.js     # Custom hook for WebSocket
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Package manager (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anudhyan/uexcelerate.git
cd uexcelerate
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanagement
DB_USER=postgres
DB_PASSWORD=your_password_here
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Database

Run the database setup script:

```bash
npm run db:setup
```

This will:
- Create the `taskmanagement` database (if it doesn't exist)
- Create the `tasks` table with proper schema
- Set up triggers for automatic timestamp updates

Alternatively, you can manually run the SQL schema:

```bash
psql -U postgres -f database/schema.sql
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will open automatically at `http://localhost:3000`

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/tasks` | Create a new task | `{ title: string, description: string }` |
| GET | `/tasks` | Get all tasks | - |
| GET | `/tasks?status=pending` | Filter tasks by status | Query param: `status` |
| GET | `/tasks/:id` | Get a single task | - |
| PATCH | `/tasks/:id` | Update task status | `{ status: string }` |
| DELETE | `/tasks/:id` | Delete a task | - |

### Example Requests

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "description": "Finish the task management app"}'
```

**Get All Tasks:**
```bash
curl http://localhost:5000/api/tasks
```

**Filter by Status:**
```bash
curl http://localhost:5000/api/tasks?status=pending
```

**Update Task Status:**
```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

## 🔄 Real-time Updates

The application uses Socket.io for real-time bidirectional communication:

### WebSocket Events

**Server Events:**
- `taskCreated` - Emitted when a new task is created
- `taskUpdated` - Emitted when a task status is updated
- `taskDeleted` - Emitted when a task is deleted

**Client Connection:**
The frontend automatically connects to the WebSocket server and listens for these events to update the UI in real-time without requiring a page refresh.

## 🎨 UI Features

### 1. Task List Display
- Shows all tasks with title, description, status badge, and creation timestamp
- Clean card-based layout with hover effects
- Responsive grid that adapts to screen size

### 2. Status Filtering
- Tab-based filtering for All/Pending/In Progress/Completed
- Active tab highlighted with color indicator
- Instant filtering without page reload

### 3. Create Task Form
- Simple form with title (required) and description (optional)
- Input validation with user feedback
- Clears form after successful submission

### 4. Status Updates
- Dropdown selector on each task card
- Three status options: Pending, In Progress, Completed
- Instant update with optimistic UI

### 5. Delete Task
- Trash icon button on each task
- Confirmation dialog before deletion
- Optimistic removal from UI

### 6. Status Badges
- **Pending**: Yellow background (`#fff3cd`)
- **In Progress**: Blue background (`#cfe2ff`)
- **Completed**: Green background (`#d1e7dd`)

### 7. Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly buttons and controls
- Optimized layouts for tablets and phones

### 8. Real-time Connection Status
- Visual indicator showing WebSocket connection status
- Green badge when connected, red when disconnected

## 🏗️ Architecture & Design Decisions

### Backend Architecture

1. **MVC Pattern**: Separated concerns with routes, controllers, and database layer
2. **Middleware Pattern**: Used Express middleware for CORS, JSON parsing, and Socket.io injection
3. **Error Handling**: Comprehensive try-catch blocks with appropriate HTTP status codes
4. **Validation**: Input validation in controller layer before database operations
5. **Database Design**: 
   - Normalized schema with proper data types
   - Automatic timestamp updates using triggers
   - Check constraints for status field
   - Indexes on frequently queried columns

### Frontend Architecture

1. **Component-Based**: Modular React components for reusability
2. **Custom Hooks**: 
   - `useTasks`: Encapsulates all task-related operations and state
   - `useSocket`: Manages WebSocket connection lifecycle
3. **Optimistic Updates**: Immediate UI updates before server confirmation for better UX
4. **State Management**: React hooks (useState, useEffect, useCallback) for local state
5. **Real-time Sync**: WebSocket listeners automatically update UI when other clients make changes
6. **Error Recovery**: Rollback mechanism for failed optimistic updates

### Key Features Implementation

**Optimistic UI Updates:**
- When creating/updating/deleting a task, UI updates immediately
- If the server request fails, changes are rolled back
- Provides instant feedback to users

**WebSocket Integration:**
- Persistent connection established on component mount
- Automatic reconnection on disconnection
- Event listeners update task list in real-time
- Duplicate prevention for optimistic updates

**Responsive Design:**
- CSS Grid and Flexbox for flexible layouts
- Media queries for different screen sizes
- Touch-friendly 44px minimum touch targets on mobile
- Overflow scrolling for long content

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Create Task**
   - ✅ Create task with title only
   - ✅ Create task with title and description
   - ✅ Try to create task without title (should show validation error)

2. **View Tasks**
   - ✅ View all tasks
   - ✅ Filter by each status
   - ✅ Verify task details display correctly

3. **Update Task**
   - ✅ Change status from pending to in-progress
   - ✅ Change status to completed
   - ✅ Verify badge color changes

4. **Delete Task**
   - ✅ Delete a task
   - ✅ Confirm deletion dialog appears

5. **Real-time Updates**
   - ✅ Open app in two browser windows
   - ✅ Create task in one window, verify it appears in other
   - ✅ Update task in one window, verify update in other
   - ✅ Delete task in one window, verify removal in other

6. **Responsive Design**
   - ✅ Test on desktop (1920px)
   - ✅ Test on tablet (768px)
   - ✅ Test on mobile (375px)

## 🐛 Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Ensure PostgreSQL is running:
   ```bash
   # On macOS with Homebrew
   brew services start postgresql
   
   # On Linux
   sudo systemctl start postgresql
   ```

2. Verify credentials in `.env` file
3. Check if database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend:**
```bash
PORT=5001 npm run dev
```

**Frontend:**
Update proxy in `package.json` to match new backend port

### WebSocket Connection Failed

1. Ensure backend server is running
2. Check CORS settings in `server.js`
3. Verify firewall isn't blocking connections

## 🎯 Bonus Features Implemented

✅ **Real-time updates with WebSocket listeners** - Socket.io integration  
✅ **Optimistic UI updates** - Instant feedback with rollback on errors  
✅ **Custom hooks for data fetching** - `useTasks` and `useSocket` hooks  
✅ **Responsive design** - Mobile-friendly layout  
✅ **Status badges** - Color-coded visual indicators  
✅ **Error handling** - Comprehensive validation and error messages  

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created for the task management application assignment.

## 🙏 Acknowledgments

- React documentation
- Express.js documentation
- Socket.io documentation
- PostgreSQL documentation

---

**Note**: This application was built without using AI code generation tools, following best practices for full-stack development with React, Node.js, and PostgreSQL.