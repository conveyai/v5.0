const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, { 
    error: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Check for Prisma error
  if (err.name === 'PrismaClientKnownRequestError') {
    return handlePrismaError(err, res);
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Handle specific Prisma errors
 */
const handlePrismaError = (err, res) => {
  // P2002: Unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target ? err.meta.target[0] : 'field';
    return res.status(409).json({ error: `The ${field} already exists` });
  }
  
  // P2025: Record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }
  
  // Default Prisma error
  return res.status(400).json({ error: err.message });
};

module.exports = errorHandler;