// src/api/todos/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const todoController = require('./todo.controller');

const router = Router();

// Get all todos for a user
router.get('/', authenticateUser, validateTenant, todoController.getTodos);

// Get todos for a matter
router.get('/matter/:matterId', authenticateUser, validateTenant, todoController.getMatterTodos);

// Create a new todo
router.post('/', authenticateUser, validateTenant, todoController.createTodo);

// Update a todo
router.put('/:id', authenticateUser, validateTenant, todoController.updateTodo);

// Mark a todo as completed
router.put('/:id/complete', authenticateUser, validateTenant, todoController.completeTodo);

module.exports = router;