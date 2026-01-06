import React from 'react';
import './TaskFilters.css';

const TaskFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="task-filters">
      {filters.map(filter => (
        <button
          key={filter.id}
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
