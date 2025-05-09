const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const tenantRoutes = require('./api/tenants');
const uploadRoutes = require('./api/upload');


// Load environment variables
dotenv.config();

// Import middleware
const { authenticateUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./api/auth');
const matterRoutes = require('./api/matters');
const clientRoutes = require('./api/clients');
const documentRoutes = require('./api/documents');
const titleSearchRoutes = require('./api/title-searches');
const todoRoutes = require('./api/todos');
const precedentRoutes = require('./api/precedents');


// Initialize Express app
const app = express();

// Initialize Prisma
const prisma = new PrismaClient();

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-domain']
}));
app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', limiter);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/matters', authenticateUser, matterRoutes);
app.use('/api/clients', authenticateUser, clientRoutes);
app.use('/api/documents', authenticateUser, documentRoutes);
app.use('/api/title-searches', authenticateUser, titleSearchRoutes);
app.use('/api/todos', authenticateUser, todoRoutes);
app.use('/api/precedents', authenticateUser, precedentRoutes);
app.use('/api/tenants', authenticateUser, tenantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;