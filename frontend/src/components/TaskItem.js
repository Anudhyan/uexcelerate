import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onStatusUpdate, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (e) => {
    onStatusUpdate(task.id, e.target.value);
  };

  return (
    <div className={`task-item ${task.isOptimistic ? 'optimistic' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            className="delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div>
          <span className={`status-badge ${task.status}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>

        <select
          className="status-selector"
          value={task.status}
          onChange={handleStatusChange}
          aria-label="Change task status"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="task-date">
          Created: {formatDate(task.created_at)}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
