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
  console.log('🔄 Starting Cloudinary file upload...');
  console.log('Cloudinary Config Check:');
  console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET');
  console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');  
  console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
  
  // Check if Cloudinary is properly configured before attempting upload
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('❌ Cloudinary not properly configured - missing environment variables');
    return res.status(500).json({
      success: false,
      error: 'Image upload service not configured. Please contact administrator.'
    });
  }
  
  upload(req, res, (err) => {
    if (err) {
      console.log('❌ Cloudinary upload error:', err.message);
      console.log('Error type:', err.constructor.name);
      
      // Don't fall back to localhost - return error instead
      return res.status(400).json({
        success: false,
        error: 'Image upload failed: ' + err.message + '. Please try again or contact administrator.'
      });
    }
    
    if (req.file) {
      console.log('✅ File uploaded successfully to Cloudinary:');
      console.log('   Original name:', req.file.originalname);
      console.log('   Cloudinary URL:', req.file.path);
      console.log('   Secure URL:', req.file.secure_url);
      
      // Verify that we got a Cloudinary URL
      if (!req.file.path || !req.file.path.includes('cloudinary.com')) {
        console.log('❌ Upload succeeded but did not get Cloudinary URL');
        return res.status(500).json({
          success: false,
          error: 'Image upload failed - invalid storage service. Please try again.'
        });
      }
    } else {
      console.log('⚠️ No file in request');
    }
    
    next();
  });
};

module.exports = { upload: uploadWithErrorHandling, cloudinary };
