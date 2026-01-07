import React, { useEffect, useState } from 'react';
// Import custom hooks for WebSocket and task management
import { useSocket } from '../hooks/useSocket';
import { useTasks } from '../hooks/useTasks';
// Import child components
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import './TaskManager.css';

// Main container component that orchestrates all task management features
// Manages WebSocket connection, task operations, and filter state
const TaskManager = () => {
  // Get WebSocket connection state from custom hook
  const { socket, connected } = useSocket();
  
  // Get task operations and state from custom hook
  const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus, deleteTask } = useTasks(socket);
  
  // Track which filter is currently active (all, pending, in-progress, completed)
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle filter tab changes - fetch tasks with new filter
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Fetch all tasks if 'all' filter is selected, otherwise fetch with status filter
    if (filter === 'all') {
      fetchTasks();
    } else {
      fetchTasks(filter);
    }
  };

  // Handle task creation - create task and catch any errors
  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Handle task status updates - update and catch any errors
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Handle task deletion with confirmation dialog
  const handleDeleteTask = async (id) => {
    // Ask user to confirm deletion before proceeding
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <div className="task-manager">
      {/* Header with title and connection status indicator */}
      <div className="header">
        <h1>Task Management</h1>
        {/* Show connection status - green when connected, red when disconnected */}
        <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● Connected' : '● Disconnected'}
        </span>
      </div>

      {/* Display error message if any error occurs during operations */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form for creating new tasks */}
      <TaskForm onSubmit={handleCreateTask} />

      {/* Filter tabs for status filtering */}
      <TaskFilters 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

      {/* Display list of tasks with loading and empty states */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TaskManager;
