// backend/src/api/tenants/tenant.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateTenantSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { name, logo_path, primaryColor } = req.body;
    
    // Check if user has permission to update tenant settings
    if (tenantId !== id) {
      return res.status(403).json({ error: 'You do not have permission to update tenant settings' });
    }
    
    // Update tenant settings
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        name,
        logo_path,
        primaryColor,
        backgroundImage
      }
    });
    
    res.status(200).json(updatedTenant);
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    res.status(500).json({ error: 'Failed to update tenant settings' });
  }
};