// src/api/title-searches/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const titleSearchController = require('./title-search.controller');

const router = Router();

// Perform a title search
router.post('/', authenticateUser, validateTenant, titleSearchController.performTitleSearch);

// Get a specific title search
router.get('/:id', authenticateUser, validateTenant, titleSearchController.getTitleSearch);

module.exports = router;