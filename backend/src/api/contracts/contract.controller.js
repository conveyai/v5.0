// backend/src/api/contracts/contract.controller.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

// Hazletts API configuration
const hazlettsConfig = {
  baseUrl: 'https://api.dev.hazdev.com.au',
  authUrl: 'https://api.dev.hazdev.com.au/auth',
  tokenUrl: 'https://api.dev.hazdev.com.au/oauth/token',
  apiUrl: 'https://api.dev.hazdev.com.au/req/lrs',
  clientId: process.env.HAZLETTS_CLIENT_ID || 'sRdsr3djSkClpgaVG6rDBOE3', // Default from docs
  clientSecret: process.env.HAZLETTS_CLIENT_SECRET || 'yourClientSecret'
};

// Get OAuth token for Hazletts API
const getHazlettsToken = async () => {
  try {
    // Step 1: Get authorization code
    const authResponse = await axios.get(`${hazlettsConfig.authUrl}?client_id=${hazlettsConfig.clientId}`);
    const code = authResponse.data.code;
    
    // Step 2: Get OAuth token
    const tokenResponse = await axios.post(
      hazlettsConfig.tokenUrl,
      {
        username: 'ConveyAI',
        code,
        client_id: hazlettsConfig.clientId
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${hazlettsConfig.clientId}:${hazlettsConfig.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return tokenResponse.data.access_token;
  } catch (error) {
    logger.error('Failed to get Hazletts token:', error);
    throw new Error('Failed to authenticate with Hazletts API');
  }
};

// Create contract using Hazletts API
exports.createContract = async (req, res) => {
  try {
    const { matterId, folioIdentifier } = req.body;
    const { tenantId, id: conveyancerId } = req.user;
    
    // Validate required fields
    if (!matterId || !folioIdentifier) {
      return res.status(400).json({ error: 'Matter ID and folio identifier are required' });
    }
    
    // Check if matter exists
    const matter = await prisma.matter.findFirst({
      where: {
        id: matterId,
        tenantId
      }
    });
    
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Generate a unique order ID
    const orderId = `CONVEYAI_${Date.now().toString(36).toUpperCase()}`;
    
    // Get access token
    const accessToken = await getHazlettsToken();
    
    // Create Title Search request to Hazletts API
    const response = await axios.post(
      hazlettsConfig.apiUrl,
      {
        orderId,
        productCode: 'LRSTLS', // Title Search
        folioIdentifier
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Create document record in database
    const document = await prisma.document.create({
      data: {
        tenantId,
        matterId,
        uploaded_by: conveyancerId,
        name: `Contract - ${folioIdentifier}`,
        description: `Contract generated using Hazletts LRS API for ${folioIdentifier}`,
        category: 'CONTRACT',
        file_path: response.data.productDetails[0].document,
        file_name: `contract_${orderId}.pdf`,
        file_type: 'PDF',
        file_extension: '.pdf',
        uploaded_at: new Date()
      }
    });
    
    // Create audit log
    await prisma.matterAuditLog.create({
      data: {
        matterId,
        userId: conveyancerId,
        tenantId,
        action: 'CREATE_CONTRACT',
        details: JSON.stringify({
          documentId: document.id,
          hazlettsOrderId: orderId
        })
      }
    });
    
    res.status(201).json({
      message: 'Contract created successfully',
      document,
      hazlettsResponse: response.data
    });
  } catch (error) {
    logger.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
};