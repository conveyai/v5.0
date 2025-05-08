const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all matters for current tenant
 */
exports.getMatters = async (req, res) => {
  try {
    const { tenantId } = req.user;
    
    const matters = await prisma.matter.findMany({
      where: {
        tenantId
      },
      include: {
        conveyancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        settlement_date: 'desc'
      }
    });
    
    res.status(200).json(matters);
  } catch (error) {
    console.error('Error fetching matters:', error);
    res.status(500).json({ error: 'Failed to fetch matters' });
  }
};

/**
 * Get a single matter by ID
 */
exports.getMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const matter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      },
      include: {
        conveyancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            identity_verified: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            identity_verified: true
          }
        },
        todos: {
          orderBy: {
            dueDate: 'asc'
          }
        }
      }
    });
    
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    res.status(200).json(matter);
  } catch (error) {
    console.error('Error fetching matter:', error);
    res.status(500).json({ error: 'Failed to fetch matter' });
  }
};

/**
 * Create a new matter
 */
exports.createMatter = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    const {
      matter_type,
      property_address,
      property_suburb,
      property_state,
      property_postcode,
      folio_identifier,
      property_status,
      property_value,
      settlement_date,
      buyerId,
      sellerId,
      amount,
      deposit_amount,
      deposit_paid,
      cooling_off_period
    } = req.body;
    
    // Create matter
    const newMatter = await prisma.matter.create({
      data: {
        tenantId,
        conveyancerId,
        matter_type,
        property_address,
        property_suburb,
        property_state: property_state || 'NSW',
        property_postcode,
        folio_identifier,
        property_status,
        property_value: property_value ? parseFloat(property_value) : null,
        date: new Date(),
        settlement_date: settlement_date ? new Date(settlement_date) : null,
        buyerId,
        sellerId,
        amount: amount ? parseFloat(amount) : null,
        deposit_amount: deposit_amount ? parseFloat(deposit_amount) : null,
        deposit_paid: deposit_paid ? parseFloat(deposit_paid) : null,
        cooling_off_period,
        status: 'Pending'
      }
    });
    
    // Create audit log
    await prisma.matterAuditLog.create({
      data: {
        matterId: newMatter.id,
        userId: conveyancerId,
        tenantId,
        action: 'CREATE',
        details: JSON.stringify(newMatter)
      }
    });
    
    res.status(201).json(newMatter);
  } catch (error) {
    console.error('Error creating matter:', error);
    res.status(500).json({ error: 'Failed to create matter' });
  }
};

/**
 * Update a matter
 */
exports.updateMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: conveyancerId } = req.user;
    const {
      matter_type,
      property_address,
      property_suburb,
      property_state,
      property_postcode,
      folio_identifier,
      property_status,
      property_value,
      settlement_date,
      buyerId,
      sellerId,
      amount,
      deposit_amount,
      deposit_paid,
      cooling_off_period,
      status
    } = req.body;
    
    // Check if matter exists
    const existingMatter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Update matter
    const updatedMatter = await prisma.matter.update({
      where: { id },
      data: {
        matter_type,
        property_address,
        property_suburb,
        property_state,
        property_postcode,
        folio_identifier,
        property_status,
        property_value: property_value ? parseFloat(property_value) : null,
        settlement_date: settlement_date ? new Date(settlement_date) : null,
        buyerId,
        sellerId,
        amount: amount ? parseFloat(amount) : null,
        deposit_amount: deposit_amount ? parseFloat(deposit_amount) : null,
        deposit_paid: deposit_paid ? parseFloat(deposit_paid) : null,
        cooling_off_period,
        status: status || existingMatter.status
      }
    });
    
    // Create audit log
    await prisma.matterAuditLog.create({
      data: {
        matterId: id,
        userId: conveyancerId,
        tenantId,
        action: 'UPDATE',
        details: JSON.stringify(updatedMatter)
      }
    });
    
    res.status(200).json(updatedMatter);
  } catch (error) {
    console.error('Error updating matter:', error);
    res.status(500).json({ error: 'Failed to update matter' });
  }
};

/**
 * Archive a matter
 */
exports.archiveMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: conveyancerId } = req.user;
    
    // Check if matter exists
    const existingMatter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Update matter to archived
    const archivedMatter = await prisma.matter.update({
      where: { id },
      data: {
        status: 'Completed',
        archived_at: new Date()
      }
    });
    
    // Create audit log
    await prisma.matterAuditLog.create({
      data: {
        matterId: id,
        userId: conveyancerId,
        tenantId,
        action: 'ARCHIVE',
        details: JSON.stringify(archivedMatter)
      }
    });
    
    res.status(200).json(archivedMatter);
  } catch (error) {
    console.error('Error archiving matter:', error);
    res.status(500).json({ error: 'Failed to archive matter' });
  }
};

/**
 * Get documents for a matter
 */
exports.getMatterDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { folderId } = req.query;
    
    // Check if matter exists
    const existingMatter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Get documents for this matter, filtered by folder if specified
    const documents = await prisma.document.findMany({
      where: {
        matterId: id,
        parent_folder_id: folderId || null
      },
      orderBy: {
        uploaded_at: 'desc'
      }
    });
    
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching matter documents:', error);
    res.status(500).json({ error: 'Failed to fetch matter documents' });
  }
};

/**
 * Get document folders for a matter
 */
exports.getMatterDocumentFolders = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { parentFolderId } = req.query;
    
    // Check if matter exists
    const existingMatter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Get folders for this matter, filtered by parent folder if specified
    const folders = await prisma.documentFolder.findMany({
      where: {
        matterId: id,
        parent_folder_id: parentFolderId || null
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching document folders:', error);
    res.status(500).json({ error: 'Failed to fetch document folders' });
  }
};

/**
 * Create a document folder for a matter
 */
exports.createDocumentFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: conveyancerId } = req.user;
    const { name, parentFolderId } = req.body;
    
    // Check if matter exists
    const existingMatter = await prisma.matter.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Create folder
    const newFolder = await prisma.documentFolder.create({
      data: {
        matterId: id,
        tenantId,
        parent_folder_id: parentFolderId || null,
        name,
        created_by: conveyancerId
      }
    });
    
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating document folder:', error);
    res.status(500).json({ error: 'Failed to create document folder' });
  }
};