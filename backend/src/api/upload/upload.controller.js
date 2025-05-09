// backend/src/api/upload/upload.controller.js
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.uploadFile = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Get the file from multer
    const file = req.file;
    
    // Generate a unique filename
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    
    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../../uploads/backgrounds');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the file
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    
    // Construct the file URL
    const fileUrl = `/uploads/backgrounds/${fileName}`;
    
    // Return the file URL
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};