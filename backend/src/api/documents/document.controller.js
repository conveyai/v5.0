const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { documentUpload } = require('../../utils/fileStorage');
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

/**
 * Upload a document
 */
exports.uploadDocument = async (req, res) => {
  try {
    // Multer should have already processed the file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { tenantId, id: conveyancerId } = req.user;
    const {
      matterId,
      name,
      parent_folder_id,
      description,
      category
    } = req.body;
    
    // Check if matter exists and belongs to tenant
    if (matterId) {
      const matter = await prisma.matter.findFirst({
        where: {
          id: matterId,
          tenantId
        }
      });
      
      if (!matter) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Matter not found' });
      }
    }
    
    // Check if parent folder exists
    if (parent_folder_id) {
      const folder = await prisma.documentFolder.findFirst({
        where: {
          id: parent_folder_id,
          tenantId
        }
      });
      
      if (!folder) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Parent folder not found' });
      }
    }
    
    // Determine file type from extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const fileType = getFileType(fileExtension);
    
    // Create document record
    const document = await prisma.document.create({
      data: {
        tenantId,
        matterId,
        parent_folder_id,
        uploaded_by: conveyancerId,
        name: name || req.file.originalname,
        description,
        category: category || 'GENERAL',
        file_path: req.file.path,
        file_name: req.file.filename,
        file_type: fileType,
        file_size: req.file.size,
        file_extension: fileExtension,
        uploaded_at: new Date()
      }
    });
    
    // Return document info
    res.status(201).json(document);
  } catch (error) {
    logger.error('Error uploading document:', error);
    
    // Clean up file if it was uploaded
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

/**
 * Get a single document
 */
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const document = await prisma.document.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    logger.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};

/**
 * Update a document
 */
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { name, description, category } = req.body;
    
    // Find document
    const document = await prisma.document.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        name,
        description,
        category
      }
    });
    
    res.status(200).json(updatedDocument);
  } catch (error) {
    logger.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

/**
 * Delete a document
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    // Find document
    const document = await prisma.document.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete from filesystem if file exists
    if (document.file_path && fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }
    
    // Delete document record
    await prisma.document.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    logger.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
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