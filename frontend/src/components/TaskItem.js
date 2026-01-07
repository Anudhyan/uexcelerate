import React from 'react';
import './TaskItem.css';

// Individual task card component
// Displays task details and allows status changes and deletion
const TaskItem = ({ task, onStatusUpdate, onDelete }) => {
  // Format date to readable format with time
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

  // Handle status change from dropdown
  const handleStatusChange = (e) => {
    onStatusUpdate(task.id, e.target.value);
  };

  return (
    <div className={`task-item ${task.isOptimistic ? 'optimistic' : ''}`}>
      {/* Task header with title and delete button */}
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          {/* Delete task button */}
          <button
            className="delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            aria-label="Delete task"
          >
            Trash
          </button>
        </div>
      </div>

      {/* Task description if provided */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Task meta information (status, creation date) */}
      <div className="task-meta">
        <div>
          {/* Status badge with color coding */}
          <span className={`status-badge ${task.status}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>

        {/* Status dropdown selector */}
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

        {/* Task creation date */}
        <div className="task-date">
          Created: {formatDate(task.created_at)}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
