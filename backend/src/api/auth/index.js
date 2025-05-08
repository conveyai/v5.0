// src/api/auth/index.js
const { Router } = require('express');
const authController = require('./auth.controller');

const router = Router();

// Register new tenant and admin user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Get current user info (protected route)
router.get('/me', authController.me);

// Change password (protected route)
router.put('/change-password', authController.changePassword);

module.exports = router;