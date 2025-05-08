// src/api/auth/index.js
const { Router } = require('express');
const authController = require('./auth.controller');

const router = Router();

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

module.exports = router;