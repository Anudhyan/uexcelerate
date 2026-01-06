# System Architecture Diagram

## Overview Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │             React Application (Port 3000)                   │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │ TaskManager  │  │  TaskForm    │  │  TaskFilters    │  │ │
│  │  │  Component   │  │  Component   │  │   Component     │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │  TaskList    │  │  TaskItem    │                       │ │
│  │  │  Component   │  │  Component   │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │   useTasks   │  │  useSocket   │                       │ │
│  │  │  Custom Hook │  │ Custom Hook  │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          │                  │
                          │ HTTP REST        │ WebSocket
                          │ (CRUD Ops)       │ (Real-time)
                          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER (Port 5000)                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Middleware Stack                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │ │
│  │  │   CORS   │→ │   JSON   │→ │ Socket.io│→ │  Routes   │  │ │
│  │  │  Enable  │  │  Parser  │  │ Injector │  │  Handler  │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Routes Layer                         │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  POST   /api/tasks         Create Task              │  │ │
│  │  │  GET    /api/tasks         Get All Tasks            │  │ │
│  │  │  GET    /api/tasks?status  Filter by Status         │  │ │
│  │  │  PATCH  /api/tasks/:id     Update Status            │  │ │
│  │  │  DELETE /api/tasks/:id     Delete Task              │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Controller Layer                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │  createTask  │  │  getTasks    │  │  updateStatus   │  │ │
│  │  │  Validation  │  │  Filtering   │  │  Validation     │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Socket.io WebSocket Server                    │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Events: taskCreated, taskUpdated, taskDeleted       │  │ │
│  │  │  Broadcast to all connected clients                  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ SQL Queries
                          │ (pg Pool)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL DATABASE (Port 5432)                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Tasks Table                            │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  id            SERIAL PRIMARY KEY                     │  │ │
│  │  │  title         VARCHAR(255) NOT NULL                  │  │ │
│  │  │  description   TEXT                                   │  │ │
│  │  │  status        VARCHAR(50) [pending/in-progress/     │  │ │
│  │  │                            completed]                 │  │ │
│  │  │  created_at    TIMESTAMP DEFAULT NOW()               │  │ │
│  │  │  updated_at    TIMESTAMP DEFAULT NOW()               │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  Indexes:                                                   │ │
│  │  - idx_tasks_status (for filtering)                        │ │
│  │  - idx_tasks_created_at (for sorting)                      │ │
│  │                                                             │ │
│  │  Triggers:                                                  │ │
│  │  - update_tasks_updated_at (auto timestamp)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Create Task Flow

```
User                React App         Backend API       PostgreSQL    All Clients
 │                      │                  │                │              │
 │──Fill Form──────────>│                  │                │              │
 │──Click Submit───────>│                  │                │              │
 │                      │                  │                │              │
 │                      │──Optimistic──────│                │              │
 │                      │  Update (local)  │                │              │
 │                      │                  │                │              │
 │                      │──POST /api/tasks>│                │              │
 │                      │   {title, desc}  │                │              │
 │                      │                  │──INSERT────────>│              │
 │                      │                  │   Query         │              │
 │                      │                  │<──New Task─────│              │
 │                      │                  │   (with ID)     │              │
 │                      │                  │                │              │
 │                      │<──201 Created────│                │              │
 │                      │   Task Object    │                │              │
 │                      │                  │                │              │
 │                      │──Replace Temp────│                │              │
 │                      │  with Real Task  │                │              │
 │                      │                  │                │              │
 │                      │                  │──taskCreated──────────────────>│
 │                      │                  │  WebSocket Event               │
 │<──UI Updated────────│                  │                │              │
 │  (instant)           │                  │                │              │
 │                      │                  │                │<──UI Update──│
 │                      │                  │                │  (real-time) │
```

### 2. Update Task Status Flow

```
User                React App         Backend API       PostgreSQL    All Clients
 │                      │                  │                │              │
 │──Select Status──────>│                  │                │              │
 │                      │                  │                │              │
 │                      │──Optimistic──────│                │              │
 │                      │  Update (local)  │                │              │
 │                      │                  │                │              │
 │                      │──PATCH           │                │              │
 │                      │  /api/tasks/:id  │                │              │
 │                      │  {status}        │                │              │
 │                      │                  │──UPDATE────────>│              │
 │                      │                  │   Query         │              │
 │                      │                  │<──Updated Task─│              │
 │                      │                  │                │              │
 │                      │<──200 OK─────────│                │              │
 │                      │   Updated Task   │                │              │
 │                      │                  │                │              │
 │                      │──Confirm Update──│                │              │
 │                      │                  │                │              │
 │                      │                  │──taskUpdated──────────────────>│
 │                      │                  │  WebSocket Event               │
 │<──UI Updated────────│                  │                │              │
 │  (instant)           │                  │                │              │
 │                      │                  │                │<──UI Sync────│
 │                      │                  │                │  (real-time) │
```

### 3. Delete Task Flow

```
User                React App         Backend API       PostgreSQL    All Clients
 │                      │                  │                │              │
 │──Click Delete───────>│                  │                │              │
 │<──Confirm Dialog────│                  │                │              │
 │──Confirm────────────>│                  │                │              │
 │                      │                  │                │              │
 │                      │──Optimistic──────│                │              │
 │                      │  Remove (local)  │                │              │
 │                      │                  │                │              │
 │                      │──DELETE          │                │              │
 │                      │  /api/tasks/:id  │                │              │
 │                      │                  │──DELETE────────>│              │
 │                      │                  │   Query         │              │
 │                      │                  │<──Deleted ID───│              │
 │                      │                  │                │              │
 │                      │<──200 OK─────────│                │              │
 │                      │   {id}           │                │              │
 │                      │                  │                │              │
 │                      │                  │──taskDeleted──────────────────>│
 │                      │                  │  WebSocket Event               │
 │<──UI Updated────────│                  │                │              │
 │  (instant)           │                  │                │              │
 │                      │                  │                │<──UI Remove──│
 │                      │                  │                │  (real-time) │
```

### 4. Real-time Synchronization Flow

```
Browser A           Browser B           Backend Server        Database
    │                   │                      │                  │
    │──Create Task─────────────────────────────>│                  │
    │                   │                      │──INSERT──────────>│
    │                   │                      │<──New Task───────│
    │<──201 Created────────────────────────────│                  │
    │                   │                      │                  │
    │                   │<──taskCreated────────│                  │
    │                   │  (WebSocket)         │                  │
    │                   │                      │                  │
    │                   │──UI Updates──────>   │                  │
    │                   │  (Automatically)     │                  │
    │                   │                      │                  │
    │                   │──Update Status───────>│                  │
    │                   │                      │──UPDATE──────────>│
    │                   │                      │<──Updated Task───│
    │                   │<──200 OK─────────────│                  │
    │                   │                      │                  │
    │<──taskUpdated────────────────────────────│                  │
    │  (WebSocket)      │                      │                  │
    │                   │                      │                  │
    │──UI Updates───>   │                      │                  │
    │  (Automatically)  │                      │                  │
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        TaskManager                               │
│  (Main Container - Orchestrates everything)                      │
│                                                                  │
│  ┌────────────────┐                                              │
│  │  useSocket     │  Custom Hook                                 │
│  │  - Connect     │  Manages WebSocket                           │
│  │  - Listen      │  Connection                                  │
│  │  - Disconnect  │                                              │
│  └────────────────┘                                              │
│                                                                  │
│  ┌────────────────┐                                              │
│  │  useTasks      │  Custom Hook                                 │
│  │  - fetchTasks  │  Manages Task State                          │
│  │  - createTask  │  & Operations                                │
│  │  - updateTask  │                                              │
│  │  - deleteTask  │                                              │
│  │  - Optimistic  │                                              │
│  └────────────────┘                                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      TaskForm                               │  │
│  │  Props: onSubmit                                           │  │
│  │  State: title, description                                 │  │
│  │  Actions: validate, submit, reset                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    TaskFilters                              │  │
│  │  Props: activeFilter, onFilterChange                       │  │
│  │  Actions: switch filter tab                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      TaskList                               │  │
│  │  Props: tasks, loading, onStatusUpdate, onDelete           │  │
│  │  Renders: Multiple TaskItem components                     │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │                  TaskItem                            │   │  │
│  │  │  Props: task, onStatusUpdate, onDelete              │   │  │
│  │  │  Displays: title, description, status, date         │   │  │
│  │  │  Actions: update status, delete                     │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application State                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  TaskManager Component State                               │  │
│  │  - activeFilter: 'all' | 'pending' | 'in-progress' |      │  │
│  │                  'completed'                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  useTasks Hook State                                        │  │
│  │  - tasks: Task[]                                           │  │
│  │  - loading: boolean                                        │  │
│  │  - error: string | null                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  useSocket Hook State                                       │  │
│  │  - socket: SocketIOClient                                  │  │
│  │  - connected: boolean                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  TaskForm Component State                                  │  │
│  │  - title: string                                           │  │
│  │  - description: string                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure Tree

```
uexcelerate/
│
├── backend/
│   ├── config/
│   │   └── database.js              [Database Connection Pool]
│   │
│   ├── controllers/
│   │   └── taskController.js        [Business Logic & Validation]
│   │       ├── validateTask()
│   │       ├── validateStatus()
│   │       ├── createTask()
│   │       ├── getTasks()
│   │       ├── getTaskById()
│   │       ├── updateTaskStatus()
│   │       └── deleteTask()
│   │
│   ├── routes/
│   │   └── taskRoutes.js            [API Route Definitions]
│   │
│   ├── scripts/
│   │   └── setupDatabase.js         [Database Setup Script]
│   │
│   ├── database/
│   │   └── schema.sql               [SQL Schema & Migrations]
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    [Express + Socket.io Server]
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskManager.js       [Main Container]
│   │   │   ├── TaskManager.css
│   │   │   ├── TaskForm.js          [Create Task Form]
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskFilters.js       [Status Filter Tabs]
│   │   │   ├── TaskFilters.css
│   │   │   ├── TaskList.js          [Task List Container]
│   │   │   ├── TaskList.css
│   │   │   ├── TaskItem.js          [Individual Task Card]
│   │   │   └── TaskItem.css
│   │   │
│   │   ├── hooks/
│   │   │   ├── useTasks.js          [Task Operations Hook]
│   │   │   └── useSocket.js         [WebSocket Hook]
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── .gitignore
│   └── package.json
│
├── README.md                        [Main Documentation]
├── PROJECT_DOCUMENTATION.md         [Detailed Architecture]
├── PROJECT_SUMMARY.md               [Project Overview]
├── QUICK_START.md                   [Quick Setup Guide]
├── UI_DESIGN_MOCKUP.html            [Visual Design Reference]
└── .gitignore

Total: 30+ files across backend and frontend
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│                                                                  │
│  React Components + CSS3                                         │
│  - Responsive Design                                             │
│  - Interactive UI                                                │
│  - Real-time Updates                                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                             │
│                                                                  │
│  Custom React Hooks                                              │
│  - useTasks (State Management)                                   │
│  - useSocket (WebSocket Management)                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Communication Layer                            │
│                                                                  │
│  HTTP REST API + WebSocket (Socket.io)                           │
│  - RESTful Endpoints                                             │
│  - Real-time Events                                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Layer                              │
│                                                                  │
│  Express.js Controllers                                          │
│  - Input Validation                                              │
│  - Business Logic                                                │
│  - Error Handling                                                │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│                                                                  │
│  PostgreSQL Database                                             │
│  - Structured Data                                               │
│  - ACID Transactions                                             │
│  - Indexes & Triggers                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

**This architecture ensures:**
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Real-time capabilities
- ✅ Performance optimization
- ✅ Error resilience
