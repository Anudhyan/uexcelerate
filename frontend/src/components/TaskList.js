import React from 'react';
// Import individual task item component
import TaskItem from './TaskItem';
import './TaskList.css';

// Task list container component
// Displays tasks in a grid layout with loading and empty states
const TaskList = ({ tasks, loading, onStatusUpdate, onDelete }) => {
  // Show loading message while fetching tasks
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  // Show empty state message when no tasks are found
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  // Render grid of task items
  return (
    <div className="task-list">
      <div className="tasks-grid">
        {/* Render a TaskItem component for each task */}
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
