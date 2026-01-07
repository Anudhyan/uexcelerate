// Import Express and the task controller
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /api/tasks - Create a new task
// Request body: { title: string, description: string }
// Response: Task object with generated ID
router.post('/', taskController.createTask);

// GET /api/tasks - Get all tasks, optionally filtered by status
// Query parameters: status (optional) - filter by 'pending', 'in-progress', or 'completed'
// Response: Array of task objects
router.get('/', taskController.getTasks);

// GET /api/tasks/:id - Get a single task by its ID
// Parameters: id - task ID
// Response: Single task object
router.get('/:id', taskController.getTaskById);

// PATCH /api/tasks/:id - Update a task's status
// Parameters: id - task ID
// Request body: { status: string }
// Response: Updated task object
router.patch('/:id', taskController.updateTaskStatus);

// DELETE /api/tasks/:id - Delete a task permanently
// Parameters: id - task ID
// Response: Confirmation message
router.delete('/:id', taskController.deleteTask);

// Export the router for use in the main server file
module.exports = router;
