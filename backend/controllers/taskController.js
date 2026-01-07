// Import the database connection pool
const pool = require('../config/database');

// Validation helper function to check task data before creating or updating
// Returns an array of error messages if validation fails, empty array if valid
const validateTask = (title, description) => {
  const errors = [];
  
  // Title is required and cannot be empty or whitespace only
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  // Title cannot exceed 255 characters (matches database column length)
  if (title && title.length > 255) {
    errors.push('Title must be less than 255 characters');
  }
  
  return errors;
};

// Validation helper for status values
// Ensures only valid status options are used
const validateStatus = (status) => {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  return validStatuses.includes(status);
};

// Create a new task
// Validates input, inserts into database, broadcasts event to all connected clients
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate input data before processing
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Insert new task into database
    // Using parameterized query prevents SQL injection attacks
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description?.trim() || '', 'pending']
    );

    const task = result.rows[0];
    
    // Broadcast task creation event to all connected WebSocket clients
    // This allows other users to see the new task in real-time
    req.io.emit('taskCreated', task);

    // Return the created task with 201 Created status code
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all tasks, optionally filtered by status
// Query parameter: status (optional) - 'pending', 'in-progress', or 'completed'
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build the SQL query dynamically based on provided filters
    let query = 'SELECT * FROM tasks';
    let params = [];

    // If status filter is provided, validate and apply it
    if (status) {
      if (!validateStatus(status)) {
        return res.status(400).json({ 
          error: 'Invalid status', 
          details: ['Status must be one of: pending, in-progress, completed'] 
        });
      }
      query += ' WHERE status = $1';
      params.push(status);
    }

    // Order tasks by creation date, newest first
    query += ' ORDER BY created_at DESC';

    // Execute the query and return results
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query for the task with the specified ID
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    // If task not found, return 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Return the task
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a task's status
// Request body: { status: string }
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Status is required
    if (!status) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: ['Status is required'] 
      });
    }

    // Validate that the provided status is one of the allowed values
    if (!validateStatus(status)) {
      return res.status(400).json({ 
        error: 'Invalid status', 
        details: ['Status must be one of: pending, in-progress, completed'] 
      });
    }

    // Update the task's status in the database
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // If task not found, return 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];
    
    // Broadcast update event to all connected WebSocket clients
    // This allows other users to see the status change in real-time
    req.io.emit('taskUpdated', task);

    // Return the updated task
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a task
// Removes the task from the database and notifies all connected clients
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the task with the specified ID
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    // If task not found, return 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Broadcast deletion event to all connected WebSocket clients
    // This allows other users to see the task removal in real-time
    req.io.emit('taskDeleted', { id: parseInt(id) });

    // Return confirmation of successful deletion
    res.status(200).json({ message: 'Task deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
