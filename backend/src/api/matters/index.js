// src/api/matters/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const matterController = require('./matter.controller');

const router = Router();

// Get all matters for current tenant
router.get('/', authenticateUser, validateTenant, matterController.getMatters);

// Get a specific matter
router.get('/:id', authenticateUser, validateTenant, matterController.getMatter);

// Create a new matter
router.post('/', authenticateUser, validateTenant, matterController.createMatter);

// Update a matter
router.put('/:id', authenticateUser, validateTenant, matterController.updateMatter);

// Archive a matter
router.put('/:id/archive', authenticateUser, validateTenant, matterController.archiveMatter);

// Get matter documents
router.get('/:id/documents', authenticateUser, validateTenant, matterController.getMatterDocuments);

// Get matter document folders
router.get('/:id/document-folders', authenticateUser, validateTenant, matterController.getMatterDocumentFolders);

// Create document folder
router.post('/:id/document-folders', authenticateUser, validateTenant, matterController.createDocumentFolder);

module.exports = router;