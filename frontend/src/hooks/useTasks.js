import { useState, useEffect, useCallback } from 'react';

// Helper function to determine the API server URL
// Handles both local development and GitHub Codespaces environments
const getCodespacesPortUrl = (port) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Codespaces forwarded ports use a dedicated subdomain pattern
  const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
  if (match) {
    return `${protocol}//${match[1]}-${port}.app.github.dev`;
  }

  // Fallback for local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }
  
  // Default fallback
  return `${protocol}//${hostname}:${port}`;
};

// Set the API base URL from environment or default to port 5000 (backend server)
const API_URL = process.env.REACT_APP_API_URL || `${getCodespacesPortUrl(5000)}/api`;

// Custom hook to manage all task operations and state
// Encapsulates task fetching, creation, updates, deletion, and real-time WebSocket events
export const useTasks = (socket) => {
  // State management
  const [tasks, setTasks] = useState([]);        // Array of task objects
  const [loading, setLoading] = useState(true);  // Loading state for API calls
  const [error, setError] = useState(null);      // Error messages from failed operations

  // Helper function to deduplicate tasks by ID
  // Prevents duplicate tasks when handling both optimistic and real-time updates
  const dedupeById = useCallback((items) => {
    const seen = new Set();
    const result = [];
    for (const item of items) {
      const key = item?.id;
      // Keep items without IDs and track seen IDs
      if (key == null) {
        result.push(item);
        continue;
      }
      if (seen.has(key)) continue;  // Skip duplicates
      seen.add(key);
      result.push(item);
    }
    return result;
  }, []);

  // Fetch tasks from the API
  // Optionally filter by status (pending, in-progress, completed)
  const fetchTasks = useCallback(async (status = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API URL with optional status filter
      const url = status ? `${API_URL}/tasks?status=${status}` : `${API_URL}/tasks`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      // Update state with fetched tasks
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task with optimistic update
  // Shows task immediately in UI before server confirms creation
  const createTask = useCallback(async (taskData) => {
    try {
      // Create temporary task with client-generated ID for optimistic update
      const tempTask = {
        id: Date.now(),  // Use timestamp as temporary ID
        ...taskData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOptimistic: true,  // Mark as temporary
      };
      
      // Add temporary task to UI immediately
      setTasks(prev => [tempTask, ...prev]);

      // Send request to server to create real task
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      // Get real task from server response
      const newTask = await response.json();
      
      // Replace temporary task with real task from server
      setTasks((prev) => {
        const replaced = prev.map((task) => (task.id === tempTask.id ? newTask : task));
        return dedupeById(replaced);
      });

      return newTask;
    } catch (err) {
      // On error, remove the optimistic task
      setTasks((prev) => prev.filter((task) => task.id !== tempTask.id));
      setError(err.message);
      throw err;
    }
  }, [dedupeById]);

  // Update a task's status with optimistic update
  // Changes appear immediately in the UI with rollback on failure
  const updateTaskStatus = useCallback(async (id, status) => {
    // Store original tasks in case we need to rollback
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update - show change immediately
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, status, updated_at: new Date().toISOString() } : task
      ));

      // Send update request to server
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update with actual server response
      const updatedTask = await response.json();
      
      setTasks(prev => prev.map(task =>
        task.id === id ? updatedTask : task
      ));

      return updatedTask;
    } catch (err) {
      // Rollback to original state on error
      setTasks(originalTasks);
      setError(err.message);
      throw err;
    }
  }, [tasks]);

  // Delete a task with optimistic update
  // Removes task from UI immediately with rollback on failure
  const deleteTask = useCallback(async (id) => {
    // Store original tasks in case we need to rollback
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update - remove immediately
      setTasks(prev => prev.filter(task => task.id !== id));

      // Send delete request to server
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      // Rollback to original state on error
      setTasks(originalTasks);
      setError(err.message);
      throw err;
    }
  }, [tasks]);

  // Listen for real-time updates via WebSocket
  // Automatically updates tasks when other clients make changes
  useEffect(() => {
    if (!socket) return;

    // Handle new task created by any client
    socket.on('taskCreated', (task) => {
      setTasks((prev) => {
        // If we have an optimistic task with matching data, replace it instead of adding duplicate
        const optimisticIndex = prev.findIndex(
          (t) => t?.isOptimistic && t?.title === task?.title && (t?.description || '') === (task?.description || '')
        );

        let next;
        if (optimisticIndex !== -1) {
          // Replace optimistic task
          next = prev.map((t, idx) => (idx === optimisticIndex ? task : t));
        } else {
          // Add new task to beginning of list
          next = [task, ...prev];
        }

        return dedupeById(next);
      });
    });

    // Handle task status update from any client
    socket.on('taskUpdated', (task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    });

    // Handle task deletion from any client
    socket.on('taskDeleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    // Cleanup: remove event listeners when component unmounts
    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [socket, dedupeById]);

  // Return hook interface for use in components
  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
};
