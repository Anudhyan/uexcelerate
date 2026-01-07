import React from 'react';
import './TaskFilters.css';

// Filter tabs component for filtering tasks by status
// Displays tabs for All, Pending, In Progress, and Completed statuses
const TaskFilters = ({ activeFilter, onFilterChange }) => {
  // Define available filter options
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="task-filters">
      {/* Render a button for each filter option */}
      {filters.map(filter => (
        <button
          key={filter.id}
          // Add 'active' class if this filter is currently selected
          className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;
