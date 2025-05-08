const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create upload directory if it doesn't exist
const createUploadDirectories = () => {
  const dirs = [
    path.join(__dirname, '../../../uploads'),
    path.join(__dirname, '../../../uploads/documents'),
    path.join(__dirname, '../../../uploads/temp')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories on startup
createUploadDirectories();

// Configure storage for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/documents'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// Configure file filter to accept only allowed file types
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = [
    // Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    // Images
    '.jpg', '.jpeg', '.png', 
    // Spreadsheets
    '.xls', '.xlsx', '.csv',
    // Presentations
    '.ppt', '.pptx',
    // Emails
    '.eml', '.msg',
    // Archives
    '.zip'
  ];
  
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed`), false);
  }
};

// Configure multer for document uploads
const documentUpload = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Temporary storage for other file operations
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/temp'));
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

const tempUpload = multer({
  storage: tempStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024
  }
});

// Helper function to clean temp directory
const cleanTempDirectory = () => {
  const tempDir = path.join(__dirname, '../../../uploads/temp');
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err;
    
    for (const file of files) {
      // Skip .gitkeep and other special files
      if (file === '.gitkeep') continue;
      
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err;
      });
    }
  });
};

// Clean temp directory periodically (every 24 hours)
setInterval(cleanTempDirectory, 24 * 60 * 60 * 1000);

module.exports = {
  documentUpload,
  tempUpload,
  createUploadDirectories
};