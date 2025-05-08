const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all clients for current tenant
 */
exports.getClients = async (req, res) => {
  try {
    const { tenantId } = req.user;
    
    const clients = await prisma.client.findMany({
      where: {
        tenantId
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

/**
 * Get a single client by ID
 */
exports.getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const client = await prisma.client.findFirst({
      where: {
        id,
        tenantId
      },
      include: {
        buyerMatters: {
          select: {
            id: true,
            property_address: true,
            property_suburb: true,
            property_state: true,
            property_postcode: true,
            matter_type: true,
            settlement_date: true
          }
        },
        sellerMatters: {
          select: {
            id: true,
            property_address: true,
            property_suburb: true,
            property_state: true,
            property_postcode: true,
            matter_type: true,
            settlement_date: true
          }
        }
      }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

/**
 * Create a new client
 */
exports.createClient = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      name,
      email,
      phone,
      address,
      client_type,
      identity_verified,
      identification_type,
      identification_number,
      notes
    } = req.body;
    
    // Check if email already exists
    if (email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          email,
          tenantId
        }
      });
      
      if (existingClient) {
        return res.status(409).json({ error: 'A client with this email already exists' });
      }
    }
    
    // Create client
    const newClient = await prisma.client.create({
      data: {
        tenantId,
        name,
        email,
        phone,
        address,
        client_type: client_type || 'INDIVIDUAL',
        identity_verified: identity_verified || false,
        identification_type,
        identification_number,
        notes
      }
    });
    
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

/**
 * Update a client
 */
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const {
      name,
      email,
      phone,
      address,
      client_type,
      identity_verified,
      identification_type,
      identification_number,
      notes
    } = req.body;
    
    // Check if client exists
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if email is already used by another client
    if (email && email !== existingClient.email) {
      const emailExists = await prisma.client.findFirst({
        where: {
          email,
          tenantId,
          id: {
            not: id
          }
        }
      });
      
      if (emailExists) {
        return res.status(409).json({ error: 'A client with this email already exists' });
      }
    }
    
    // Update client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        client_type,
        identity_verified,
        identification_type,
        identification_number,
        notes
      }
    });
    
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

/**
 * Verify client identity
 */
exports.verifyClientIdentity = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { identification_type, identification_number } = req.body;
    
    // Check if client exists
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Update client verification status
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        identity_verified: true,
        identification_type,
        identification_number,
        verified_at: new Date()
      }
    });
    
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('Error verifying client identity:', error);
    res.status(500).json({ error: 'Failed to verify client identity' });
  }
};