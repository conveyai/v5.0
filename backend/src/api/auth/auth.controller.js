const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * Login controller
 */
exports.login = async (req, res) => {
  try {
    const { email, password, tenantDomain } = req.body;
    
    if (!email || !password || !tenantDomain) {
      return res.status(400).json({ error: 'Email, password, and company domain are required' });
    }
    
    // Find the tenant by domain
    const tenant = await prisma.tenant.findUnique({
      where: { domain: tenantDomain }
    });
    
    if (!tenant) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Find the conveyancer by email and tenant
    const conveyancer = await prisma.conveyancer.findFirst({
      where: {
        email,
        tenantId: tenant.id
      }
    });
    
    if (!conveyancer) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, conveyancer.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: conveyancer.id, email: conveyancer.email, tenantId: tenant.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    const user = {
      id: conveyancer.id,
      name: conveyancer.name,
      email: conveyancer.email
    };
    
    res.status(200).json({
      token,
      user,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        logo_path: tenant.logo_path,
        primaryColor: tenant.primaryColor
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get current user info
 */
exports.me = async (req, res) => {
  try {
    const { id, tenantId } = req.user;
    
    // Find the conveyancer
    const conveyancer = await prisma.conveyancer.findUnique({
      where: { id }
    });
    
    if (!conveyancer) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find the tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    
    // Get contact count for tenant (for dashboard stats)
    const contactCount = await prisma.client.count({
      where: { tenantId }
    });
    
    // Return user info
    const user = {
      id: conveyancer.id,
      name: conveyancer.name,
      email: conveyancer.email
    };
    
    res.status(200).json({
      user,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        logo_path: tenant.logo_path,
        primaryColor: tenant.primaryColor,
        contactCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Logout (just a placeholder since JWT is stateless)
 */
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Request password reset
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, tenantDomain } = req.body;
    
    if (!email || !tenantDomain) {
      return res.status(400).json({ error: 'Email and company domain are required' });
    }
    
    // Find the tenant by domain
    const tenant = await prisma.tenant.findUnique({
      where: { domain: tenantDomain }
    });
    
    if (!tenant) {
      // Don't reveal if tenant exists or not for security
      return res.status(200).json({ message: 'Password reset email sent if account exists' });
    }
    
    // Find the conveyancer by email and tenant
    const conveyancer = await prisma.conveyancer.findFirst({
      where: {
        email,
        tenantId: tenant.id
      }
    });
    
    if (!conveyancer) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: 'Password reset email sent if account exists' });
    }
    
    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { conveyancerId: conveyancer.id }
    });
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1); // Token expires in 1 hour
    
    // Save reset token
    await prisma.passwordReset.create({
      data: {
        conveyancerId: conveyancer.id,
        token,
        expires: expiresIn
      }
    });
    
    // In a real application, send an email with the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);
    
    // In development, just return the token in the response for testing
    // In production, remove this and use proper email sending
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json({
        message: 'Password reset email sent if account exists',
        resetToken: token // Only include in development
      });
    }
    
    res.status(200).json({ message: 'Password reset email sent if account exists' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    // Find the password reset record
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token }
    });
    
    if (!passwordReset) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Check if token is expired
    if (passwordReset.expires < new Date()) {
      // Delete expired token
      await prisma.passwordReset.delete({
        where: { token }
      });
      
      return res.status(400).json({ error: 'Reset token has expired' });
    }
    
    // Hash the new password
    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the user's password
    await prisma.conveyancer.update({
      where: { id: passwordReset.conveyancerId },
      data: { password_hash: hash }
    });
    
    // Delete the used token
    await prisma.passwordReset.delete({
      where: { token }
    });
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Find the conveyancer
    const conveyancer = await prisma.conveyancer.findUnique({
      where: { id }
    });
    
    if (!conveyancer) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, conveyancer.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash the new password
    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the password
    await prisma.conveyancer.update({
      where: { id },
      data: { password_hash: hash }
    });
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Register new tenant and admin user
 */
exports.register = async (req, res) => {
  try {
    const { 
      tenantName, 
      tenantDomain, 
      userName, 
      email, 
      password 
    } = req.body;
    
    // Validate required fields
    if (!tenantName || !tenantDomain || !userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if tenant domain already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain: tenantDomain }
    });
    
    if (existingTenant) {
      return res.status(409).json({ error: 'This domain is already registered' });
    }
    
    // Check if email already exists
    const existingUser = await prisma.conveyancer.findFirst({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'This email is already registered' });
    }
    
    // Create new tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        domain: tenantDomain,
        logo_path: null,
        primaryColor: '#4F46E5',
        active: true,
        updated_at: new Date()
      }
    });
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create admin user for the tenant
    const user = await prisma.conveyancer.create({
      data: {
        tenantId: tenant.id,
        name: userName,
        email,
        password_hash: passwordHash,
        role: 'ADMIN',
        active: true,
        updated_at: new Date()
      }
    });
    
    res.status(201).json({ 
      message: 'Registration successful',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};