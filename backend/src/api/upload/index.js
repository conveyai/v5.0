// backend/src/api/upload/index.js
const { Router } = require('express');
const multer = require('multer');
const { authenticateUser } = require('../../middleware/auth');
const uploadController = require('./upload.controller');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateUser, upload.single('file'), uploadController.uploadFile);

module.exports = router;