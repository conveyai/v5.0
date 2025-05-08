// src/api/precedents/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const precedentController = require('./precedent.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Get all precedent folders 
router.get('/folders', 
  authenticateUser, 
  validateTenant, 
  precedentController.getPrecedentFolders
);

// Create precedent folder
router.post('/folders', 
  authenticateUser, 
  validateTenant, 
  precedentController.createPrecedentFolder
);

// Get all precedents
router.get('/', 
  authenticateUser, 
  validateTenant, 
  precedentController.getPrecedents
);

// Upload a precedent
router.post('/', 
  authenticateUser, 
  validateTenant, 
  upload.single('file'), 
  precedentController.uploadPrecedent
);

// Get a precedent
router.get('/:id', 
  authenticateUser, 
  validateTenant, 
  precedentController.getPrecedent
);

// Update a precedent
router.put('/:id', 
  authenticateUser, 
  validateTenant, 
  precedentController.updatePrecedent
);

// Delete a precedent
router.delete('/:id', 
  authenticateUser, 
  validateTenant, 
  precedentController.deletePrecedent
);

module.exports = router;