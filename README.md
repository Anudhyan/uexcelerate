# Task Management Application with Real-time Updates

A full-stack task management system built with React, Node.js, Express, PostgreSQL, and Socket.io for real-time updates. This application demonstrates a complete modern web development stack where users can create, manage, and track tasks with instant synchronization across multiple connected clients.

## Table of Contents

- [Overview](#overview)
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

## Overview

This task management application is designed to help teams and individuals organize their work efficiently. The application provides a clean, intuitive interface for managing tasks with real-time collaboration features. Whether you are working alone or with a team, you can create tasks, set their status, and see updates instantly as other users make changes. The application is built on proven, production-ready technologies and follows best practices for full-stack web development.

## Features

### Backend Capabilities

The backend is built with Node.js and Express, providing a robust REST API for all task management operations. It includes comprehensive validation and error handling to ensure data integrity. The PostgreSQL database stores all tasks securely with proper schema design and indexing for optimal performance. All communication is protected with CORS configuration, allowing only authorized origins to access the API.

The backend supports filtering tasks by status, creating new tasks with validation, updating task statuses, and deleting tasks. Each operation triggers real-time WebSocket events that notify all connected clients of changes, ensuring everyone sees the most current information without needing to refresh.

### Frontend Features

The frontend provides a beautiful, responsive interface built with modern React. Users can easily create new tasks with a simple form that validates input before submission. The task list displays all tasks with color-coded status badges making it easy to see at a glance which tasks are pending, in progress, or completed.

Interactive tabs allow filtering tasks by status, and a dropdown selector on each task lets users update the status instantly. The application uses optimistic UI updates, meaning changes appear immediately in the interface before the server confirms them, creating a snappy, responsive feel. When other users make changes, the interface updates automatically through WebSocket listeners, keeping everyone in sync.

## Technology Stack

### Backend Technologies

The backend is built with industry-standard technologies chosen for their reliability and performance. Node.js provides a fast JavaScript runtime environment, while Express.js offers a minimal yet powerful web framework for building REST APIs. PostgreSQL serves as the database, providing ACID compliance and powerful querying capabilities. Socket.io handles real-time bidirectional communication between server and clients, with automatic fallback to polling if WebSocket is not available.

The application uses the pg library to communicate with PostgreSQL, dotenv for secure environment variable management, and cors middleware to handle cross-origin requests properly.

### Frontend Technologies

React provides a component-based architecture that makes the user interface modular and maintainable. The Socket.io-client library enables real-time communication with the server. CSS3 styling is used throughout, with a responsive design that works seamlessly on phones, tablets, and desktops.

## Project Structure

The project is organized into two main directories: the backend API and the frontend user interface. The backend contains all server-side logic for handling requests and managing data, while the frontend contains all React components and client-side logic for the user interface.

```
uexcelerate/
├── backend/                     # Node.js/Express API server
│   ├── config/
│   │   └── database.js          # Database connection pool configuration
│   ├── controllers/
│   │   └── taskController.js    # Business logic and validation for tasks
│   ├── routes/
│   │   └── taskRoutes.js        # REST API route definitions
│   ├── scripts/
│   │   └── setupDatabase.js     # Database initialization script
│   ├── database/
│   │   └── schema.sql           # SQL schema definition
│   ├── server.js                # Express server entry point with Socket.io
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Environment variables template
│
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html          # HTML entry point
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TaskManager.js   # Main container component
│   │   │   ├── TaskForm.js      # Task creation form
│   │   │   ├── TaskFilters.js   # Status filter tabs
│   │   │   ├── TaskList.js      # Task list container
│   │   │   ├── TaskItem.js      # Individual task card
│   │   │   └── [CSS files]      # Component styling
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useTasks.js      # Hook for task operations
│   │   │   └── useSocket.js     # Hook for WebSocket connection
│   │   ├── App.js               # Root React component
│   │   └── index.js             # React entry point
│   └── package.json             # Frontend dependencies
│
└── README.md                    # This file
```

## Prerequisites

Before running this application, make sure you have the following tools installed on your system.

**Node.js** (version 14 or higher) is required to run the application. You can download it from the official Node.js website. The installation includes npm, the Node package manager, which you will use to install dependencies.

**PostgreSQL** (version 12 or higher) is required for the database. Download it from the official PostgreSQL website and follow the installation instructions for your operating system. Make sure the PostgreSQL service is running before you start the application.

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anudhyan/uexcelerate.git
cd Installation

Setting up the application involves installing dependencies for both the backend and frontend, configuring the database, and preparing the environment variables.

### Backend Setup

Navigate to the backend directory and install all required Node packages. These packages include Express for the web server, PostgreSQL driver for database connection, Socket.io for real-time communication, and other utilities.

```bash
cd backend
npm install
```

After installation, create a configuration file for your environment variables. Copy the example file and then edit it with your actual database credentials.

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanagement
DB_USER=postgres
DB_PASSWORD=your_password_here
FRONTEND_URL=http://localhost:3000
```

Initialize your database by running the setup script. This creates the taskmanagement database and sets up the required tables with proper schema design.

```bash
npm run db:setup
```

This command creates the database, defines the tasks table with appropriate columns and constraints, and sets up triggers for automatic timestamp updates. If you prefer to set up the database manually instead, you can run the SQL script directly using your PostgreSQL client.

### Frontend Setup

In a new terminal, navigate to the frontend directory and install dependencies. These packages include React, React DOM, Socket.io client, and build tools needed to run the development server.
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

TheRunning the Application

Starting the application requires running both the backend server and the frontend development server in separate terminals.

### Starting the Backend Server

Open a terminal and navigate to the backend directory, then start the development server. The server will connect to your PostgreSQL database and listen for incoming requests.

```bash
cd backend
npm run dev
```

The backend server will start on port 5000. You should see output confirming the server is running and connected to the database.

### Starting the Frontend Application
API Endpoints

The backend provides a REST API for managing tasks. All endpoints are prefixed with `/api`.

The application supports creating tasks, retrieving all tasks with optional filtering by status, getting individual tasks, updating task status, and deleting tasks. Here is a reference table for all available endpoints:

| HTTP Method | Endpoint | Description | Request Body |
|------------|----------|-------------|--------------|
| POST | `/tasks` | Create a new task | `{ title: string, description: string }` |
| GET | `/tasks` | Get all tasks, optionally filtered by status | Query param: `status` |
| GET | `/tasks/:id` | Retrieve a specific task by its ID | None |
| PATCH | `/tasks/:id` | Update a task's status | `{ status: string }` |
| DELETE | `/tasks/:id` | Remove a task permanently | None |

### Example API Requests

You can test these endpoints using curl from the command line. The following examples show how to interact with the API.

**Create a new task:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "description": "Finish the task management app"}'
```

**Get all tasks:**

```bash
curl http://localhost:5000/api/tasks
```

**Filter tasks by status:**

```bash
curl http://localhost:5000/api/tasks?status=pending
```

**Update a task's status:**

```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Delete a task:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

## Real-time Updates

One of the key features of this application is real-time synchronization across multiple clients using WebSocket technology. When one user creates, updates, or deletes a task, all other connected users see the changes immediately without needing to refresh their page.

### How Real-time Communication Works

The application uses Socket.io to establish a persistent WebSocket connection between the client and server. When a user makes any change to a task through the API, the server broadcasts events to all connected clients, which automatically update their interfaces.

The server emits the following events to keep clients synchronized:

- `taskCreated` - Sent when a new task is created by any user
- `taskUpdated` - Sent when a task's status is changed
- `taskDeleted` - Sent when a task is deleted

The frontend listens for these WebSocket events and automatically updates the task list without requiring any user action. This means if you have the application open in two browser windows, creating a task in one window will immediately appear in the other window.

## UI Features

### Task List Display

The main interface displays all your tasks in a clean, card-based layout. Each task shows its title, description if provided, current status with a color-coded badge, and when it was created. The layout is responsive and adapts to different screen sizes automatically.

### Status Filtering

You can filter tasks by their status using interactive tabs at the top of the task list. The available filters are All Tasks, Pending, In Progress, and Completed. Click any tab to instantly filter the list without needing to reload the page. The active filter is highlighted so you always know what view you are in.

### Creating Tasks

To create a new task, use the form at the top of the page. Enter a task title (required) and optionally add a description. The form validates your input and clears automatically after successful submission, allowing you to quickly create multiple tasks.

### Updating Task Status

Each task has a dropdown selector that lets you change its status. Choose from Pending, In Progress, or Completed to reflect the current state of your work. Changes are applied instantly with our optimistic UI, so you see the update immediately before it is confirmed by the server.

### Deleting Tasks

To remove a task, click the trash icon button on its card. You will be asked to confirm the deletion to prevent accidental removal. Once confirmed, the task is removed from your list.

### Visual Status Indicators

Tasks use color-coded badges to show their status at a glance:

- **Pending**: Yellow background for tasks that have not been started
- **In Progress**: Blue background for tasks currently being worked on
- **Completed**: Green background for finished tasks

### Responsive Design

The application works seamlessly on devices of all sizes. It uses a mobile-first design approach with breakpoints at 768px and 480px for optimal viewing on phones, tablets, and desktop computers. All buttons and controls are touch-friendly with appropriate sizes for mobile use.

### Connection Status

A visual indicator in the header shows whether your application is connected to the server. A green dot means you are connected and real-time updates will work. A red dot indicates a disconnection, and the application will attempt to reconnect automatically.

## Architecture & Design Decisions

### Backend Architecture

The backend follows the Model-View-Controller pattern, separating concerns into distinct layers. The routes layer handles HTTP requests, the controllers layer implements business logic and validation, and the database layer manages data persistence. This separation makes the code more maintainable and testable.

Express middleware is used to add functionality like CORS support for cross-origin requests, JSON parsing for request bodies, and Socket.io integration for real-time updates. Error handling is comprehensive, with try-catch blocks in all async operations and appropriate HTTP status codes returned for different scenarios.

The database schema is carefully designed with proper data types, constraints, and indexes. A CHECK constraint on the status column ensures only valid status values are stored. Automatic timestamp fields track when tasks are created and modified. Indexes on frequently queried columns like status and created_at optimize query performance.

### Frontend Architecture

React components are organized into a hierarchy with the TaskManager component at the top managing overall state and orchestrating child components. Each component has a single responsibility, making them reusable and easy to understand.

Custom React hooks encapsulate complex logic. The `useTasks` hook manages all task-related operations and state, making it easy to use task functionality in any component. The `useSocket` hook handles WebSocket connection management and lifecycle.

Optimistic UI updates provide instant feedback to users. When you create, update, or delete a task, the interface updates immediately. If the server request succeeds, the update is confirmed. If it fails, the change is rolled back and an error is displayed. This creates a responsive, snappy feel even with network latency.

Real-time synchronization keeps all connected clients in sync. WebSocket listeners automatically update the local task list when other users make changes, without requiring any manual refresh or polling.

### Key Implementation Details

**Optimistic Updates:** When creating a task, a temporary task with a client-generated ID is added to the UI immediately. Once the server responds with the real task (including the database-generated ID), the temporary task is replaced. If the request fails, the temporary task is removed and an error is shown.

**Status Filtering:** Filtering is implemented both on the backend (using SQL WHERE clauses) and frontend (by sending a status query parameter). This reduces data transfer and provides a better user experience.

**Input Validation:** Validation happens in two places for security. Client-side validation provides immediate feedback to users. Server-side validation prevents invalid data from being stored in the database, protecting against malicious or malformed requests.

**Error Handling:** Both the backend and frontend handle errors gracefully. The backend returns appropriate HTTP status codes and error messages. The frontend catches errors, rolls back optimistic updates, and displays user-friendly error messages.

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

3. Testing the Application

After installation and startup, it's important to verify that all features work correctly. Follow this testing checklist to ensure everything is functioning as expected.

### Creating and Managing Tasks

Start by creating a task with just a title to verify the basic functionality. Then create another task with both a title and description. Try creating a task without a title to verify that validation works and prevents invalid submissions. Once you have created several tasks, verify that they all display correctly in the list with their titles, descriptions, and status badges.

### Filtering Tasks

Click through each filter tab (All, Pending, In Progress, Completed) to verify that the list filters correctly. Create a few tasks and update their statuses, then verify that the filters show the correct tasks.

### Updating and Deleting Tasks

Try changing a task's status from one option to another using the dropdown selector. Verify that the status badge color changes to match the new status. Delete a task and confirm that you see a confirmation dialog before it is removed.

### Real-time Updates

Open the application in two separate browser windows or tabs. Create a task in one window and verify it appears immediately in the other without needing to refresh. Update a task's status in one window and verify it updates in the other. Delete a task in one window and verify it disappears from the other.

### Responsive Design

Resize your browser window to test the mobile layout. The interface should adapt smoothly and remain usable at all sizes. Test on actual mobile devices if possible to verify touch functionality.

## Troubleshooting Common Issues

### Database Connection Errors

If the backend fails to connect to PostgreSQL, first ensure that the PostgreSQL service is running on your system. Check that the credentials in your `.env` file match your PostgreSQL setup. Verify that the database exists by checking with a PostgreSQL client.

### Port Already in Use

If you see an error that a port is already in use, you can change the PORT in the backend `.env` file and update the proxy setting in the frontend `package.json` to match.

### WebSocket Connection Issues

If the frontend shows a disconnected status or you do not see real-time updates, ensure the backend server is running and has successfully connected to the database. Check your browser's developer console for any error messages. Verify that CORS is configured correctly in the server settings.

## Bonus Features

This application includes several bonus features that enhance the user experience and demonstrate best practices:

**Real-time WebSocket Integration:** Multiple users can see updates instantly as they happen, without needing to refresh.

**Optimistic UI Updates:** Changes appear immediately in the interface before being confirmed by the server, creating a responsive user experience.

**Custom React Hooks:** Reusable logic for tasks and WebSocket connections makes the code more maintainable.

**Responsive Design:** The application works beautifully on phones, tablets, and desktop computers.

**Comprehensive Error Handling:** Both the frontend and backend handle errors gracefully with appropriate feedback.

**SQL Security:** All database queries use parameterized statements to prevent SQL injection attacks.

## License

This project is open source and available for educational purposes.

## Author

Created as a full-stack web development project demonstrating modern technologies and best practices.

## Acknowledgments

This application was built using industry-standard libraries and frameworks including React, Express.js, PostgreSQL, and Socket.io. Special thanks to the open-source communities that maintain these excellent tools