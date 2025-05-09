// Create file at: backend/src/api/contracts/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const contractController = require('./contract.controller');

const router = Router();

// Create a contract using Hazletts API
router.post('/', authenticateUser, validateTenant, contractController.createContract);

module.exports = router;