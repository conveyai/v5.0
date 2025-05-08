// src/api/documents/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const documentController = require('./document.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Upload a document
router.post('/', 
  authenticateUser, 
  validateTenant, 
  upload.single('file'), 
  documentController.uploadDocument
);

// Get a document
router.get('/:id', authenticateUser, validateTenant, documentController.getDocument);

// Update a document
router.put('/:id', authenticateUser, validateTenant, documentController.updateDocument);

// Delete a document
router.delete('/:id', authenticateUser, validateTenant, documentController.deleteDocument);

module.exports = router;