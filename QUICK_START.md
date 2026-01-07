# Quick Setup Guide

Get the task management application up and running in just a few minutes. This guide assumes you have Node.js and PostgreSQL already installed on your system.

## Prerequisites

Before you begin, make sure you have the following tools installed:

- **Node.js** (version 14 or higher) for running JavaScript on the server and building the frontend
- **PostgreSQL** (version 12 or higher) for the database
- **npm** or **yarn** - a package manager for installing dependencies (comes with Node.js)

## Installation Steps

### Backend Setup

Navigate to the backend directory and install all required dependencies. This downloads and installs Express, PostgreSQL driver, Socket.io, and other tools needed by the server.

```bash
cd backend
npm install
```

Configure your database connection by copying the example environment file and editing it with your PostgreSQL credentials.

```bash
cp .env.example .env
```

Open the `.env` file in a text editor and update these values with your PostgreSQL username and password:

```bash
DB_USER=postgres
DB_PASSWORD=your_password
```

Initialize the database with the required tables and schema:

```bash
npm run db:setup
```

Start the backend server:

```bash
npm run dev
```

The backend is now running on http://localhost:5000. You should see a message confirming the server is running and connected to PostgreSQL.

### Frontend Setup

Open a new terminal (keep the backend running in the first one) and navigate to the frontend directory. Install dependencies and start the development server:

```bash
cd frontend
npm install
npm start
```

The frontend will automatically open in your browser at http://localhost:3000.

## Verify Everything is Working

Once both servers are running, you should see a green "Connected" status indicator in the application header. Try creating a task by entering a title and clicking "Add Task". The task should appear in the list immediately.

To verify real-time updates are working, open the application in a second browser window or tab. Create a task in one window and you should see it appear instantly in the other window without needing to refresh.

## Common Issues and Solutions

### Backend Fails to Connect to Database

Ensure PostgreSQL is running on your system. Verify that your database credentials in `backend/.env` match your PostgreSQL setup. You can test your connection by trying to connect with `psql -U postgres`.

### Port Already in Use

If you get an error saying port 5000 or 3000 is already in use, you can change the port in the backend `.env` file:

```bash
PORT=5001 npm run dev
```

Then update the frontend to connect to the new port.

### Application Shows "Disconnected"

Ensure the backend server is running and has successfully connected to the database. Check your browser's developer console (press F12) for any error messages. The WebSocket connection requires the backend to be running.

## Features to Try

Create a new task with a title and optional description. Filter the tasks using the status tabs to see only tasks in a specific status. Click the dropdown menu on any task to change its status. Delete a task by clicking the trash icon and confirming the deletion. Open the application in two browser windows and create a task in one - it should appear instantly in the other. Resize your browser window to see the responsive design adapt to different screen sizes.

## Project Organization

The project contains a backend directory with the Express server and API, a frontend directory with the React application, comprehensive documentation in README.md and PROJECT_DOCUMENTATION.md, and this quick start guide.

## Where to Find Help

For comprehensive documentation including API endpoint details and architecture explanations, see README.md. For technical details about how the application is built and design decisions, see PROJECT_DOCUMENTATION.md. To test API endpoints manually, you can use curl commands shown in the full documentation.

## Testing with API

You can test the backend API directly using curl from the command line:

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
