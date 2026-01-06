import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useTasks } from '../hooks/useTasks';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import './TaskManager.css';

const TaskManager = () => {
  const { socket, connected } = useSocket();
  const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus, deleteTask } = useTasks(socket);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      fetchTasks();
    } else {
      fetchTasks(filter);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
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
      <div className="header">
        <h1>Task Management</h1>
        <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● Connected' : '● Disconnected'}
        </span>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <TaskForm onSubmit={handleCreateTask} />

      <TaskFilters 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

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
