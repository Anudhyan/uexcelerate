import React, { useState } from 'react';
import './TaskForm.css';

// Task creation form component
// Allows users to create new tasks with title and optional description
const TaskForm = ({ onSubmit }) => {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that title is not empty
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Submit task data to parent component
    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    // Clear form fields after successful submission
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create New Task</h2>
      
      {/* Title input field - required */}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength={255}
          required
        />
      </div>

      {/* Description input field - optional */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
        />
      </div>

      {/* Submit button */}
      <button type="submit" className="submit-btn">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
