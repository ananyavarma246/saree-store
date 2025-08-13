const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary with error handling
console.log('🔧 Configuring Cloudinary...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');  
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful:', result);
  })
  .catch(error => {
    console.log('❌ Cloudinary connection failed:', error.message);
  });

// Configure cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alankree-sarees', // folder name in cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 600, height: 750, crop: 'fill', quality: 'auto' }
    ]
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer with cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Wrap upload with error handling
const uploadWithErrorHandling = (req, res, next) => {
  console.log('🔄 Starting file upload...');
  
  upload(req, res, (err) => {
    if (err) {
      console.log('❌ Upload error:', err.message);
      console.log('Error type:', err.constructor.name);
      
      // If Cloudinary fails, log the error but continue
      if (err.message.includes('cloudinary') || err.message.includes('Cloudinary')) {
        console.log('⚠️ Cloudinary upload failed, continuing without file...');
        req.uploadError = err.message;
        return next();
      }
      
      return res.status(400).json({
        success: false,
        error: 'File upload failed: ' + err.message
      });
    }
    
    if (req.file) {
      console.log('✅ File uploaded successfully:');
      console.log('   Original name:', req.file.originalname);
      console.log('   File path:', req.file.path);
      console.log('   Secure URL:', req.file.secure_url);
    } else {
      console.log('⚠️ No file in request');
    }
    
    next();
  });
};

module.exports = { upload: uploadWithErrorHandling, cloudinary };
