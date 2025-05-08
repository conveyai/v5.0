// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const conveyancer = await prisma.conveyancer.findUnique({
      where: { id: decoded.id },
      include: { tenant: true }
    });
    
    if (!conveyancer) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    req.user = {
      id: conveyancer.id,
      email: conveyancer.email,
      name: conveyancer.name,
      tenantId: conveyancer.tenantId,
      tenantName: conveyancer.tenant.name,
      tenantDomain: conveyancer.tenant.domain
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

exports.validateTenant = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const requestDomain = req.headers['x-tenant-domain'];
    
    if (!requestDomain) {
      return res.status(400).json({ error: 'Tenant domain is required' });
    }
    
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        domain: requestDomain
      }
    });
    
    if (!tenant) {
      return res.status(403).json({ error: 'Invalid tenant access' });
    }
    
    next();
  } catch (error) {
    console.error('Tenant validation error:', error);
    return res.status(500).json({ error: 'Tenant validation failed' });
  }
};