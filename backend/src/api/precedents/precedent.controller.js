// src/api/precedents/precedent.controller.js
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { documentUpload } = require('../../utils/fileStorage');
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

/**
 * Get all precedent folders for current tenant
 */
exports.getPrecedentFolders = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { parentFolderId } = req.query;
    
    const folders = await prisma.precedentFolder.findMany({
      where: {
        tenantId,
        parent_folder_id: parentFolderId || null
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(folders);
  } catch (error) {
    logger.error('Error fetching precedent folders:', error);
    res.status(500).json({ error: 'Failed to fetch precedent folders' });
  }
};

/**
 * Create a precedent folder
 */
exports.createPrecedentFolder = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    const { name, parentFolderId } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    
    // Check if parent folder exists (if provided)
    if (parentFolderId) {
      const parentFolder = await prisma.precedentFolder.findFirst({
        where: {
          id: parentFolderId,
          tenantId
        }
      });
      
      if (!parentFolder) {
        return res.status(404).json({ error: 'Parent folder not found' });
      }
    }
    
    const folder = await prisma.precedentFolder.create({
      data: {
        tenantId,
        name,
        parent_folder_id: parentFolderId || null,
        created_by: conveyancerId
      }
    });
    
    res.status(201).json(folder);
  } catch (error) {
    logger.error('Error creating precedent folder:', error);
    res.status(500).json({ error: 'Failed to create precedent folder' });
  }
};

/**
 * Get all precedents in a folder
 */
exports.getPrecedents = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { folderId } = req.query;
    
    const precedents = await prisma.precedent.findMany({
      where: {
        tenantId,
        folder_id: folderId || null
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(precedents);
  } catch (error) {
    logger.error('Error fetching precedents:', error);
    res.status(500).json({ error: 'Failed to fetch precedents' });
  }
};

/**
 * Upload a precedent
 */
exports.uploadPrecedent = async (req, res) => {
  try {
    // Multer should have already processed the file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { tenantId, id: conveyancerId } = req.user;
    const {
      name,
      folder_id,
      description,
      category,
      content
    } = req.body;
    
    // Check if folder exists
    if (folder_id) {
      const folder = await prisma.precedentFolder.findFirst({
        where: {
          id: folder_id,
          tenantId
        }
      });
      
      if (!folder) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Folder not found' });
      }
    }
    
    // Determine file type from extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const fileType = getFileType(fileExtension);
    
    // Create precedent record
    const precedent = await prisma.precedent.create({
      data: {
        tenantId,
        folder_id,
        uploaded_by: conveyancerId,
        name: name || req.file.originalname,
        description,
        category: category || 'GENERAL',
        file_path: req.file.path,
        file_name: req.file.filename,
        file_type: fileType,
        file_size: req.file.size,
        file_extension: fileExtension,
        content: content || null,
        uploaded_at: new Date(),
        updated_at: new Date()
      }
    });
    
    // Return precedent info
    res.status(201).json(precedent);
  } catch (error) {
    logger.error('Error uploading precedent:', error);
    
    // Clean up file if it was uploaded
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload precedent' });
  }
};

/**
 * Get a single precedent
 */
exports.getPrecedent = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const precedent = await prisma.precedent.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!precedent) {
      return res.status(404).json({ error: 'Precedent not found' });
    }
    
    res.status(200).json(precedent);
  } catch (error) {
    logger.error('Error fetching precedent:', error);
    res.status(500).json({ error: 'Failed to fetch precedent' });
  }
};

/**
 * Update a precedent
 */
exports.updatePrecedent = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { name, description, category, content } = req.body;
    
    // Find precedent
    const precedent = await prisma.precedent.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!precedent) {
      return res.status(404).json({ error: 'Precedent not found' });
    }
    
    // Update precedent
    const updatedPrecedent = await prisma.precedent.update({
      where: { id },
      data: {
        name,
        description,
        category,
        content,
        updated_at: new Date()
      }
    });
    
    res.status(200).json(updatedPrecedent);
  } catch (error) {
    logger.error('Error updating precedent:', error);
    res.status(500).json({ error: 'Failed to update precedent' });
  }
};

/**
 * Delete a precedent
 */
exports.deletePrecedent = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    // Find precedent
    const precedent = await prisma.precedent.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!precedent) {
      return res.status(404).json({ error: 'Precedent not found' });
    }
    
    // Delete from filesystem if file exists
    if (precedent.file_path && fs.existsSync(precedent.file_path)) {
      fs.unlinkSync(precedent.file_path);
    }
    
    // Delete precedent record
    await prisma.precedent.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Precedent deleted successfully' });
  } catch (error) {
    logger.error('Error deleting precedent:', error);
    res.status(500).json({ error: 'Failed to delete precedent' });
  }
};

/**
 * Get file type based on extension
 */
function getFileType(extension) {
  const documentTypes = {
    '.pdf': 'PDF',
    '.doc': 'Word',
    '.docx': 'Word',
    '.txt': 'Text',
    '.rtf': 'Rich Text',
    '.jpg': 'Image',
    '.jpeg': 'Image',
    '.png': 'Image',
    '.xls': 'Excel',
    '.xlsx': 'Excel',
    '.csv': 'CSV',
    '.ppt': 'PowerPoint',
    '.pptx': 'PowerPoint',
    '.eml': 'Email',
    '.msg': 'Email',
    '.zip': 'Archive'
  };
  
  return documentTypes[extension] || 'Other';
}