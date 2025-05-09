// backend/src/api/tenants/index.js
const { Router } = require('express');
const { authenticateUser, validateTenant } = require('../../middleware/auth');
const tenantController = require('./tenant.controller');

const router = Router();

router.put('/:id/settings', authenticateUser, validateTenant, tenantController.updateTenantSettings);

module.exports = router;