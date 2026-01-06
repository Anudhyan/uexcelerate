const pool = require('../config/database');

// Validation helper
const validateTask = (title, description) => {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (title && title.length > 255) {
    errors.push('Title must be less than 255 characters');
  }
  
  return errors;
};

const validateStatus = (status) => {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  return validStatuses.includes(status);
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate input
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description?.trim() || '', 'pending']
    );

    const task = result.rows[0];
    
    // Emit WebSocket event for real-time update
    req.io.emit('taskCreated', task);

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all tasks or filter by status
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM tasks';
    let params = [];

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

    query += ' ORDER BY created_at DESC';

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
    
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: ['Status is required'] 
      });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ 
        error: 'Invalid status', 
        details: ['Status must be one of: pending, in-progress, completed'] 
      });
    }

    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];
    
    // Emit WebSocket event for real-time update
    req.io.emit('taskUpdated', task);

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Emit WebSocket event for real-time update
    req.io.emit('taskDeleted', { id: parseInt(id) });

    res.status(200).json({ message: 'Task deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
