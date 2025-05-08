// src/api/clients/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const clientController = require('./client.controller');

const router = Router();

// Get all clients for current tenant
router.get('/', authenticateUser, validateTenant, clientController.getClients);

// Get a specific client
router.get('/:id', authenticateUser, validateTenant, clientController.getClient);

// Create a new client
router.post('/', authenticateUser, validateTenant, clientController.createClient);

// Update a client
router.put('/:id', authenticateUser, validateTenant, clientController.updateClient);

// Verify client identity
router.put('/:id/verify', authenticateUser, validateTenant, clientController.verifyClientIdentity);

module.exports = router;