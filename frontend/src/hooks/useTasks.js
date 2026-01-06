import { useState, useEffect, useCallback } from 'react';

const getCodespacesPortUrl = (port) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
  if (match) {
    return `${protocol}//${match[1]}-${port}.app.github.dev`;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }
  return `${protocol}//${hostname}:${port}`;
};

const API_URL = process.env.REACT_APP_API_URL || `${getCodespacesPortUrl(5000)}/api`;

export const useTasks = (socket) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dedupeById = useCallback((items) => {
    const seen = new Set();
    const result = [];
    for (const item of items) {
      const key = item?.id;
      if (key == null) {
        result.push(item);
        continue;
      }
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(item);
    }
    return result;
  }, []);

  // Fetch tasks from API
  const fetchTasks = useCallback(async (status = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = status ? `${API_URL}/tasks?status=${status}` : `${API_URL}/tasks`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
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
  const createTask = useCallback(async (taskData) => {
    try {
      // Optimistic update - add temporary task
      const tempTask = {
        id: Date.now(),
        ...taskData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOptimistic: true,
      };
      
      setTasks(prev => [tempTask, ...prev]);

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

      const newTask = await response.json();
      
      // Replace optimistic task with real task
      setTasks((prev) => {
        const replaced = prev.map((task) => (task.id === tempTask.id ? newTask : task));
        return dedupeById(replaced);
      });

      return newTask;
    } catch (err) {
      // Remove optimistic task on error
      setTasks((prev) => prev.filter((task) => task.id !== tempTask.id));
      setError(err.message);
      throw err;
    }
  }, [dedupeById]);

  // Update task status with optimistic update
  const updateTaskStatus = useCallback(async (id, status) => {
    // Store original task for rollback
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, status, updated_at: new Date().toISOString() } : task
      ));

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

      const updatedTask = await response.json();
      
      // Update with actual server response
      setTasks(prev => prev.map(task =>
        task.id === id ? updatedTask : task
      ));

      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      setError(err.message);
      throw err;
    }
  }, [tasks]);

  // Delete a task with optimistic update
  const deleteTask = useCallback(async (id) => {
    // Store original tasks for rollback
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update - remove immediately
      setTasks(prev => prev.filter(task => task.id !== id));

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      setError(err.message);
      throw err;
    }
  }, [tasks]);

  // Listen for real-time updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on('taskCreated', (task) => {
      setTasks((prev) => {
        // If the creator had an optimistic task, replace it instead of inserting a new row.
        const optimisticIndex = prev.findIndex(
          (t) => t?.isOptimistic && t?.title === task?.title && (t?.description || '') === (task?.description || '')
        );

        let next;
        if (optimisticIndex !== -1) {
          next = prev.map((t, idx) => (idx === optimisticIndex ? task : t));
        } else {
          next = [task, ...prev];
        }

        return dedupeById(next);
      });
    });

    socket.on('taskUpdated', (task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    });

    socket.on('taskDeleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [socket, dedupeById]);

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
