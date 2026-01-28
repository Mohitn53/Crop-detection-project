const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crop-disease-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Multer upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Mock upload for offline/demo mode
const mockUpload = (req, res, next) => {
  if (req.file) {
    // If real upload worked, continue
    next();
  } else if (req.body.mockImage) {
    // Mock image URL for demo
    req.file = {
      path: 'https://res.cloudinary.com/demo/image/upload/v1/crop-disease-app/mock-leaf.jpg',
      filename: 'mock-leaf',
    };
    next();
  } else {
    next();
  }
};

module.exports = { cloudinary, upload, mockUpload };
